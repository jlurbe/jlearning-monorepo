'use client';

import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import {
  Trash2,
  Search,
  Filter,
  Plus,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import * as api from '../services/api';
import {
  type JapaneseWord,
  WordType,
  StudyStatus,
  DifficultyLevel,
} from '@jlearning-monorepo/api-common/contexts/shared/domain/japanese-word.type';

interface VocabularyTableProps {
  entries: JapaneseWord[];
  onUpdate: (id: string, updates: Partial<JapaneseWord>) => void;
  onDelete: (id: string) => void;
  onAdd: (entry: Omit<JapaneseWord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAddMultiple: (
    entries: Omit<JapaneseWord, 'id' | 'createdAt' | 'updatedAt'>[]
  ) => void;
}

interface EditingCell {
  rowId: string;
  field: keyof JapaneseWord;
}

export function VocabularyTable({
  entries,
  onUpdate,
  onDelete,
  onAdd,
  onAddMultiple,
}: VocabularyTableProps) {
  // Column visibility state for 'exampleSentence' and 'notes'
  const [visibleColumns, setVisibleColumns] = useState<{
    exampleSentence: boolean;
    notes: boolean;
  }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vocabTableVisibleColumns');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // Ignore parse errors and use defaults
          console.debug('Failed to parse saved column visibility', e);
        }
      }
    }
    return { exampleSentence: true, notes: true };
  });

  // State for showing/hiding the column menu
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Close the column menu on outside click
  useEffect(() => {
    if (!showColumnMenu) return;
    const handle = (e: MouseEvent) => {
      setShowColumnMenu(false);
    };
    window.addEventListener('click', handle);
    return () => window.removeEventListener('click', handle);
  }, [showColumnMenu]);

  // Save visibleColumns to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'vocabTableVisibleColumns',
        JSON.stringify(visibleColumns)
      );
    }
  }, [visibleColumns]);
  // Initialize filters from URL parameters
  const getInitialSearchTerm = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  };

  const getInitialFilterType = () => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    if (
      typeParam &&
      (typeParam === 'all' ||
        Object.values(WordType).includes(typeParam as WordType))
    ) {
      return typeParam as WordType | 'all';
    }
    return 'all';
  };

  const getInitialFilterStatus = () => {
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get('status');
    if (
      statusParam &&
      (statusParam === 'all' ||
        Object.values(StudyStatus).includes(statusParam as StudyStatus))
    ) {
      return statusParam as StudyStatus | 'all';
    }
    return 'all';
  };

  const [searchTerm, setSearchTerm] = useState(getInitialSearchTerm);
  const [filterType, setFilterType] = useState<WordType | 'all'>(
    getInitialFilterType
  );
  const [filterStatus, setFilterStatus] = useState<StudyStatus | 'all'>(
    getInitialFilterStatus
  );
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // Sorting state
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAddWordModal, setShowAddWordModal] = useState(false);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (showAddWordModal) {
      // Add classes to prevent scrolling and remove margins
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    } else {
      // Remove the classes
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    };
  }, [showAddWordModal]);
  const [newEntry, setNewEntry] = useState<
    Omit<JapaneseWord, 'id' | 'createdAt' | 'updatedAt'>
  >({
    word: '',
    reading: '',
    translation: '',
    pronunciation: '',
    exampleSentence: '',
    type: WordType.NOUN,
    difficulty: DifficultyLevel.BEGINNER,
    status: StudyStatus.NEW,
    notes: '',
    reviewedAt: null,
  });

  // Initialize pagination state from URL parameters
  const getInitialPageSize = () => {
    const params = new URLSearchParams(window.location.search);
    const urlPageSize = params.get('pageSize');
    if (urlPageSize === 'all') return 1000;
    if (urlPageSize && !isNaN(Number(urlPageSize))) return Number(urlPageSize);
    return 10;
  };

  const getInitialCurrentPage = () => {
    const params = new URLSearchParams(window.location.search);
    const urlCurrentPage = params.get('page');
    if (urlCurrentPage && !isNaN(Number(urlCurrentPage)))
      return Number(urlCurrentPage);
    return 1;
  };

  // Pagination state
  const [pageSize, setPageSize] = useState<number>(getInitialPageSize);
  const [currentPage, setCurrentPage] = useState<number>(getInitialCurrentPage);

  // Helper to format enum values for display (e.g., 'NEW' -> 'Not Learned')
  const formatEnumValue = (value: string) => {
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // 1. Filter
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.translation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.pronunciation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || entry.type === filterType;
    const matchesStatus =
      filterStatus === 'all' || entry.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // 2. Sort
  const sortedEntries =
    sortBy && sortOrder
      ? [...filteredEntries].sort((a, b) => {
          const aValue = (a as any)[sortBy] ?? '';
          const bValue = (b as any)[sortBy] ?? '';
          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        })
      : filteredEntries;

  // Compute pagination
  const totalPages = Math.max(1, Math.ceil(sortedEntries.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedEntries.length);
  const paginatedEntries = sortedEntries.slice(startIndex, endIndex);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const handleMultiColumnPaste = useCallback(
    (pastedData: string, rowId: string) => {
      const rows = pastedData.split('\n').filter((row) => row.trim());
      const firstRow = rows[0];
      const columns = firstRow.split('\t');

      if (columns.length === 1) return;

      const fieldOrder = [
        'word',
        'reading',
        'translation',
        'pronunciation',
        'exampleSentence',
        'notes',
      ] as const;

      type PasteField = (typeof fieldOrder)[number];
      const updates: Partial<Pick<JapaneseWord, PasteField>> = {};
      columns.forEach((value, index) => {
        if (index < fieldOrder.length) {
          const field = fieldOrder[index];
          updates[field] = value.trim();
        }
      });

      onUpdate(rowId, updates as Partial<JapaneseWord>);
    },
    [onUpdate]
  );

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Only handle paste if we're not in an input field
      const activeElement = document.activeElement;
      if (
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const pastedData = e.clipboardData?.getData('text');
      if (!pastedData) return;

      // Find the currently focused cell or the first cell if none
      const focusedRow =
        document.querySelector('tr:focus-within') ||
        document.querySelector('tbody tr');
      if (!focusedRow) return;

      const rowId = focusedRow.getAttribute('data-row-id');
      if (!rowId) return;

      e.preventDefault();
      handleMultiColumnPaste(pastedData, rowId);
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => document.removeEventListener('paste', handleGlobalPaste);
  }, [handleMultiColumnPaste]);

  // Sync all state to URL whenever it changes
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    // Update search term
    if (searchTerm) {
      params.set('q', searchTerm);
    } else {
      params.delete('q');
    }

    // Update filter type
    if (filterType && filterType !== 'all') {
      params.set('type', String(filterType));
    } else {
      params.delete('type');
    }

    // Update filter status
    if (filterStatus && filterStatus !== 'all') {
      params.set('status', String(filterStatus));
    } else {
      params.delete('status');
    }

    // Update page size
    if (pageSize >= 1000) {
      params.set('pageSize', 'all');
    } else {
      params.set('pageSize', String(pageSize));
    }

    // Update current page
    params.set('page', String(currentPage));

    const newUrl = `${url.pathname}${
      params.toString() ? `?${params.toString()}` : ''
    }${url.hash}`;
    window.history.replaceState({}, '', newUrl);
  }, [searchTerm, filterType, filterStatus, pageSize, currentPage]);

  const handleCellClick = <K extends keyof JapaneseWord>(
    rowId: string,
    field: K,
    currentValue: JapaneseWord[K]
  ) => {
    if (field === 'id') return;
    setEditingCell({ rowId, field });
    setEditValue(String(currentValue));
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;

    let processedValue: string | WordType | DifficultyLevel | StudyStatus =
      editValue;

    // Type conversion based on field
    if (
      editingCell.field === 'type' ||
      editingCell.field === 'difficulty' ||
      editingCell.field === 'status'
    ) {
      processedValue = editValue as WordType | DifficultyLevel | StudyStatus;
    }

    onUpdate(editingCell.rowId, {
      [editingCell.field]: processedValue,
    } as Partial<JapaneseWord>);
    setEditingCell(null);
  };

  const handleDropdownChange = (
    value: string,
    rowId: string,
    field: keyof JapaneseWord
  ) => {
    if (field === 'type') {
      onUpdate(rowId, { [field]: value as WordType } as Partial<JapaneseWord>);
    } else if (field === 'difficulty') {
      onUpdate(rowId, {
        [field]: value as DifficultyLevel,
      } as Partial<JapaneseWord>);
    } else if (field === 'status') {
      onUpdate(rowId, {
        [field]: value as StudyStatus,
      } as Partial<JapaneseWord>);
    }
    setEditingCell(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleNewEntryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents any default form submission behavior
      handleAiFill();
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
  };

  const handleAiFill = async () => {
    if (!newEntry.word.trim()) return;

    setIsAiLoading(true);
    try {
      const results = await api.analyzeText(newEntry.word);
      if (results.length > 0) {
        // Ensure that the results from the API conform to the expected type
        // by providing default values for missing properties.
        const formattedResults = results.map((result) => ({
          word: result.word || '',
          reading: result.reading || '',
          translation: result.translation || '',
          pronunciation: result.pronunciation || '',
          exampleSentence: result.exampleSentence || '',
          type: result.type || WordType.OTHER,
          difficulty: result.difficulty || DifficultyLevel.BEGINNER,
          status: result.status || StudyStatus.NEW,
          notes: result.notes || '',
          reviewedAt: null,
        }));
        onAddMultiple(formattedResults);
        // Clear the input and hide the modal
        setShowAddWordModal(false);
        setNewEntry({
          word: '',
          reading: '',
          translation: '',
          pronunciation: '',
          exampleSentence: '',
          type: WordType.NOUN,
          difficulty: DifficultyLevel.BEGINNER,
          status: StudyStatus.NEW,
          notes: '',
          reviewedAt: null,
        });
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      // You could add a toast notification here to inform the user of the failure.
    } finally {
      setIsAiLoading(false);
    }
  };
  const renderBadgeCell = <K extends keyof JapaneseWord>(
    entry: JapaneseWord,
    field: K,
    value: JapaneseWord[K]
  ) => {
    const isEditing =
      editingCell?.rowId === entry.id && editingCell?.field === field;

    if (isEditing) {
      const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
          setEditingCell(null);
        }
      };

      const renderSelect = (enumObject: object) => (
        <Select
          open={true}
          onOpenChange={handleOpenChange}
          value={editValue}
          onValueChange={(val) =>
            handleDropdownChange(val, entry?.id || '', field)
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(enumObject).map((enumValue) => (
              <SelectItem key={enumValue} value={enumValue}>
                {formatEnumValue(enumValue)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

      if (field === 'type') return renderSelect(WordType);
      if (field === 'difficulty') return renderSelect(DifficultyLevel);
      if (field === 'status') return renderSelect(StudyStatus);
    }

    // Render colored badges for non-editing state
    let badgeColor = '';
    let displayValue = String(value);

    if (field === 'status' && value) {
      badgeColor = getStatusColor(value as StudyStatus);
      displayValue = formatEnumValue(String(value));
    } else if (field === 'difficulty' && value) {
      badgeColor = getDifficultyColor(String(value));
      displayValue = formatEnumValue(String(value));
    } else if (field === 'type' && value) {
      badgeColor = getTypeColor(value as WordType);
      displayValue = formatEnumValue(String(value));
    }

    return (
      <Badge
        className={`cursor-pointer hover:opacity-80 ${badgeColor}`}
        onClick={() => handleCellClick(entry?.id || '', field, value)}
      >
        {displayValue}
      </Badge>
    );
  };

  const renderEditableCell = <K extends keyof JapaneseWord>(
    entry: JapaneseWord,
    field: K,
    value: JapaneseWord[K]
  ) => {
    const isEditing =
      editingCell?.rowId === entry.id && editingCell?.field === field;

    if (isEditing) {
      return (
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSaveEdit}
          className="h-8"
        />
      );
    }

    return (
      <div
        className="cursor-pointer hover:bg-muted/50 p-1 rounded min-h-[2rem] flex items-center"
        onClick={() => handleCellClick(entry?.id || '', field, value)}
      >
        {String(value)}
      </div>
    );
  };

  const getStatusColor = (status: StudyStatus) => {
    switch (status) {
      case StudyStatus.MASTERED:
        return 'bg-green-600 text-white dark:bg-green-700 dark:text-white';
      case StudyStatus.REVIEWING:
        return 'bg-blue-600 text-white dark:bg-blue-700 dark:text-white';
      case StudyStatus.LEARNING:
        return 'bg-orange-600 text-white dark:bg-orange-700 dark:text-white';
      case StudyStatus.NEW:
        return 'bg-slate-600 text-white dark:bg-slate-700 dark:text-white';
      default:
        return 'bg-slate-600 text-white dark:bg-slate-700 dark:text-white';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-emerald-600 text-white dark:bg-emerald-700 dark:text-white';
      case 'intermediate':
        return 'bg-orange-600 text-white dark:bg-orange-700 dark:text-white';
      case 'advanced':
        return 'bg-red-600 text-white dark:bg-red-700 dark:text-white';
      default:
        return 'bg-slate-600 text-white dark:bg-slate-700 dark:text-white';
    }
  };

  const getTypeColor = (type: WordType) => {
    switch (type) {
      case 'noun':
        return 'bg-blue-600 text-white dark:bg-blue-700 dark:text-white';
      case 'verb':
        return 'bg-purple-600 text-white dark:bg-purple-700 dark:text-white';
      case 'adjective':
        return 'bg-pink-600 text-white dark:bg-pink-700 dark:text-white';
      case 'adverb':
        return 'bg-indigo-600 text-white dark:bg-indigo-700 dark:text-white';
      case 'particle':
        return 'bg-teal-600 text-white dark:bg-teal-700 dark:text-white';
      case 'conjunction':
        return 'bg-cyan-600 text-white dark:bg-cyan-700 dark:text-white';
      case 'interjection':
        return 'bg-rose-600 text-white dark:bg-rose-700 dark:text-white';
      case 'counter':
        return 'bg-violet-600 text-white dark:bg-violet-700 dark:text-white';
      case 'expression':
        return 'bg-lime-600 text-white dark:bg-lime-700 dark:text-white';
      default:
        return 'bg-slate-600 text-white dark:bg-slate-700 dark:text-white';
    }
  };

  const uniqueTypes = [...new Set(entries.map((e) => e.type))].filter(
    (t): t is WordType => Boolean(t)
  );

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <p className="text-muted-foreground text-lg">
          No vocabulary entries yet.
        </p>
        <p className="text-muted-foreground mb-4">
          Add your first Japanese word to get started!
        </p>
        <Button
          onClick={() => setShowAddWordModal(true)}
          className="flex items-center gap-2 mx-auto"
        >
          <Plus className="h-4 w-4" />
          Add First Word
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {/* Filters, Page Size and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 animate-slide-down">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search words, readings, translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={filterType}
          onValueChange={(value) => setFilterType(value as WordType | 'all')}
        >
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterStatus}
          onValueChange={(value) =>
            setFilterStatus(value as StudyStatus | 'all')
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(StudyStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {formatEnumValue(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Page size selector */}
        <Select
          value={pageSize >= 1000 ? 'all' : String(pageSize)}
          onValueChange={(v) => {
            if (v === 'all') {
              setPageSize(1000);
            } else {
              setPageSize(Number(v));
            }
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Clear Filters
        </Button>

        <Button
          onClick={() => setShowAddWordModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Word
        </Button>
      </div>

      {/* Results count and Options Button aligned below filters */}
      <div className="flex items-center justify-between mb-2 mt-2">
        <p className="text-sm text-muted-foreground m-0">
          Showing {filteredEntries.length === 0 ? 0 : startIndex + 1}-{endIndex}{' '}
          of {filteredEntries.length} filtered entries ({entries.length} total)
        </p>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setShowColumnMenu((v) => !v);
            }}
            title="Table options"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          {showColumnMenu && (
            <div
              className="absolute right-0 mt-2 w-44 bg-popover border border-border rounded shadow-lg z-50 p-2 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-semibold text-sm mb-2">
                Column Visibility
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm py-1">
                <input
                  type="checkbox"
                  checked={visibleColumns.exampleSentence}
                  onChange={() =>
                    setVisibleColumns((v) => ({
                      ...v,
                      exampleSentence: !v.exampleSentence,
                    }))
                  }
                />
                Example
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm py-1">
                <input
                  type="checkbox"
                  checked={visibleColumns.notes}
                  onChange={() =>
                    setVisibleColumns((v) => ({
                      ...v,
                      notes: !v.notes,
                    }))
                  }
                />
                Notes
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              {[
                { key: 'word', label: 'Word' },
                { key: 'reading', label: 'Reading' },
                { key: 'translation', label: 'Translation' },
                { key: 'pronunciation', label: 'Pronunciation' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left p-3 font-semibold cursor-pointer select-none hover:underline"
                  onClick={() => {
                    if (sortBy !== col.key) {
                      setSortBy(col.key);
                      setSortOrder('asc');
                    } else if (sortOrder === 'asc') {
                      setSortOrder('desc');
                    } else if (sortOrder === 'desc') {
                      setSortBy(null);
                      setSortOrder(null);
                    } else {
                      setSortOrder('asc');
                    }
                  }}
                >
                  {col.label}
                  {sortBy === col.key && (
                    <span className="ml-1">
                      {sortOrder === 'asc' && '▲'}
                      {sortOrder === 'desc' && '▼'}
                      {sortOrder === null && '⨯'}
                    </span>
                  )}
                </th>
              ))}
              {/* Conditionally render Example and Notes columns */}
              {visibleColumns.exampleSentence && (
                <th
                  className="text-left p-3 font-semibold cursor-pointer select-none hover:underline"
                  onClick={() => {
                    if (sortBy !== 'exampleSentence') {
                      setSortBy('exampleSentence');
                      setSortOrder('asc');
                    } else if (sortOrder === 'asc') {
                      setSortOrder('desc');
                    } else if (sortOrder === 'desc') {
                      setSortBy(null);
                      setSortOrder(null);
                    } else {
                      setSortOrder('asc');
                    }
                  }}
                >
                  Example
                  {sortBy === 'exampleSentence' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' && '▲'}
                      {sortOrder === 'desc' && '▼'}
                      {sortOrder === null && '⨯'}
                    </span>
                  )}
                </th>
              )}
              {visibleColumns.notes && (
                <th
                  className="text-left p-3 font-semibold cursor-pointer select-none hover:underline"
                  onClick={() => {
                    if (sortBy !== 'notes') {
                      setSortBy('notes');
                      setSortOrder('asc');
                    } else if (sortOrder === 'asc') {
                      setSortOrder('desc');
                    } else if (sortOrder === 'desc') {
                      setSortBy(null);
                      setSortOrder(null);
                    } else {
                      setSortOrder('asc');
                    }
                  }}
                >
                  Notes
                  {sortBy === 'notes' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' && '▲'}
                      {sortOrder === 'desc' && '▼'}
                      {sortOrder === null && '⨯'}
                    </span>
                  )}
                </th>
              )}
              <th className="text-left px-0.5 py-1 font-semibold">Type</th>
              <th className="text-left px-0.5 py-1 font-semibold">
                Difficulty
              </th>
              <th className="text-left px-0.5 py-1 font-semibold">Status</th>
              {/* Actions column only */}
              <th className="text-center px-1 py-1 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEntries.map((entry, index) => (
              <tr
                key={entry.id}
                data-row-id={entry.id}
                className={`border-b hover:bg-muted/50 transition-colors ${
                  index % 2 === 0 ? 'bg-card' : 'bg-background'
                } animate-fade-in`}
                style={{ animationDelay: `${index * 0.02}s` }}
                tabIndex={0}
              >
                <td className="px-1 py-1">
                  <div className="font-medium text-lg">
                    {renderEditableCell(entry, 'word', entry.word)}
                  </div>
                </td>
                <td className="px-1 py-1">
                  <div className="text-sm">
                    {renderEditableCell(entry, 'reading', entry.reading)}
                  </div>
                </td>
                <td className="px-1 py-1">
                  <div className="text-sm">
                    {renderEditableCell(
                      entry,
                      'translation',
                      entry.translation
                    )}
                  </div>
                </td>
                <td className="px-1 py-1">
                  <div className="text-sm font-mono">
                    {renderEditableCell(
                      entry,
                      'pronunciation',
                      entry.pronunciation
                    )}
                  </div>
                </td>
                {visibleColumns.exampleSentence && (
                  <td className="px-1 py-1 max-w-xs">
                    <div className="text-sm">
                      {renderEditableCell(
                        entry,
                        'exampleSentence',
                        entry.exampleSentence
                      )}
                    </div>
                  </td>
                )}
                {visibleColumns.notes && (
                  <td className="px-1 py-1 max-w-xs">
                    <div className="text-sm">
                      {renderEditableCell(entry, 'notes', entry.notes)}
                    </div>
                  </td>
                )}
                <td className="px-0.5 py-0.5">
                  {renderBadgeCell(entry, 'type', entry.type)}
                </td>
                <td className="px-0.5 py-0.5">
                  {renderBadgeCell(entry, 'difficulty', entry.difficulty)}
                </td>
                <td className="px-0.5 py-0.5">
                  {renderBadgeCell(entry, 'status', entry.status)}
                </td>
                {/* Merged Actions & Options cell: only delete in body */}
                <td className="px-1 py-1 text-center align-middle">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onDelete(entry?.id || '')}
                    className="text-destructive hover:text-destructive h-7 w-7 hover:scale-110 transition-transform"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEntries.length === 0 && searchTerm && (
        <div className="text-center py-8 animate-fade-in">
          <p className="text-muted-foreground">
            No entries match your search criteria.
          </p>
        </div>
      )}

      {/* Pagination controls */}
      {filteredEntries.length > 0 && (
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="text-sm text-muted-foreground">
            Page {safeCurrentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add Word Modal */}
      {showAddWordModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 animate-in fade-in-0 duration-300"
          style={{ margin: 0, padding: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddWordModal(false);
            }
          }}
        >
          <div
            className="bg-background border rounded-xl shadow-2xl w-96 max-w-[calc(100vw-2rem)] animate-in zoom-in-95 fade-in-0 duration-300"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              margin: 0,
              padding: '2rem',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Add New Word
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter a Japanese word or sentence
                </p>
              </div>
            </div>

            {/* Form */}
            <div style={{ margin: 0 }}>
              <div style={{ margin: 0 }}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Word or Sentence
                </label>
                <Input
                  value={newEntry.word}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, word: e.target.value })
                  }
                  onKeyDown={handleNewEntryKeyDown}
                  placeholder="例: こんにちは (Hello)"
                  className="w-full h-12 text-base border-2 focus:border-purple-500 transition-colors"
                  style={{ margin: 0 }}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter or click AI Save to analyze with AI
                </p>
              </div>

              {/* Buttons */}
              <div
                className="flex items-center gap-3 justify-end"
                style={{ marginTop: '2rem', margin: 0 }}
              >
                <Button
                  variant="outline"
                  className="px-6 h-11 border-2 hover:bg-muted transition-colors"
                  onClick={() => {
                    setShowAddWordModal(false);
                    setNewEntry({
                      word: '',
                      reading: '',
                      translation: '',
                      pronunciation: '',
                      exampleSentence: '',
                      type: WordType.NOUN,
                      difficulty: DifficultyLevel.BEGINNER,
                      status: StudyStatus.NEW,
                      notes: '',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="h-11 px-6 font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  onClick={handleAiFill}
                  disabled={isAiLoading || !newEntry.word.trim()}
                >
                  {isAiLoading ? (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>AI Save</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
