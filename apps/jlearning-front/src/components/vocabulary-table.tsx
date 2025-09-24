"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Trash2, Search, Filter, Plus, Sparkles } from 'lucide-react';
import * as api from '../services/api';
import {
  type VocabularyEntry,
  WordType,
  StudyStatus,
  DifficultyLevel,
} from "@jlearning-monorepo/api-common/shared/vocabulary"

interface VocabularyTableProps {
  entries: VocabularyEntry[]
  onUpdate: (id: string, updates: Partial<VocabularyEntry>) => void
  onDelete: (id: string) => void
  onAdd: (entry: Omit<VocabularyEntry, "id" | "createdAt" | "updatedAt">) => void
  onAddMultiple: (entries: Omit<VocabularyEntry, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

interface EditingCell {
  rowId: string
  field: keyof VocabularyEntry
}

export function VocabularyTable({
  entries,
  onUpdate,
  onDelete,
  onAdd,
  onAddMultiple,
}: VocabularyTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<WordType | "all">("all")
  const [filterStatus, setFilterStatus] = useState<StudyStatus | "all">("all")
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [editValue, setEditValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showNewRow, setShowNewRow] = useState(false)
  const [newEntry, setNewEntry] = useState<Omit<VocabularyEntry, "id" | "createdAt" | "updatedAt">>({
    word: "",
    reading: "",
    translation: "",
    pronunciation: "",
    exampleSentence: "",
    type: WordType.NOUN,
    difficulty: DifficultyLevel.BEGINNER,
    status: StudyStatus.NEW,
    notes: "",
  })

  // Helper to format enum values for display (e.g., 'NEW' -> 'Not Learned')
  const formatEnumValue = (value: string) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.pronunciation.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || entry.type === filterType
    const matchesStatus = filterStatus === "all" || entry.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Only handle paste if we're not in an input field
      const activeElement = document.activeElement
      if (activeElement?.tagName === "INPUT" || activeElement?.tagName === "TEXTAREA") {
        return
      }

      const pastedData = e.clipboardData?.getData("text")
      if (!pastedData) return

      // Find the currently focused cell or the first cell if none
      const focusedRow = document.querySelector("tr:focus-within") || document.querySelector("tbody tr")
      if (!focusedRow) return

      const rowId = focusedRow.getAttribute("data-row-id")
      if (!rowId) return

      e.preventDefault()
      handleMultiColumnPaste(pastedData, rowId)
    }

    document.addEventListener("paste", handleGlobalPaste)
    return () => document.removeEventListener("paste", handleGlobalPaste)
  }, [])

  const handleMultiColumnPaste = (pastedData: string, rowId: string) => {
    const rows = pastedData.split("\n").filter((row) => row.trim())
    const firstRow = rows[0]
    const columns = firstRow.split("\t")

    if (columns.length === 1) return

    const fieldOrder: (keyof VocabularyEntry)[] = [
      "word",
      "reading",
      "translation",
      "pronunciation",
      "exampleSentence",
      "notes",
    ]

    const updates: Partial<VocabularyEntry> = {}
    columns.forEach((value, index) => {
      if (index < fieldOrder.length) {
        const field = fieldOrder[index]
        updates[field] = value.trim() as any
      }
    })

    onUpdate(rowId, updates)
  }

  const handleCellClick = (rowId: string, field: keyof VocabularyEntry, currentValue: any) => {
    if (field === "createdAt" || field === "updatedAt" || field === "id") return
    setEditingCell({ rowId, field })
    setEditValue(String(currentValue))
  }

  const handleSaveEdit = () => {
    if (!editingCell) return

    let processedValue: any = editValue

    // Type conversion based on field
    if (editingCell.field === "type" || editingCell.field === "difficulty" || editingCell.field === "status") {
      processedValue = editValue as WordType | DifficultyLevel | StudyStatus
    }

    onUpdate(editingCell.rowId, { [editingCell.field]: processedValue })
    setEditingCell(null)
  }

  const handleDropdownChange = (value: string, rowId: string, field: keyof VocabularyEntry) => {
    onUpdate(rowId, { [field]: value as any })
    setEditingCell(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit()
    } else if (e.key === "Escape") {
      setEditingCell(null)
    }
  }

  const handleNewEntryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents any default form submission behavior
      handleAiFill();
    }
  };

  const handleAiFill = async () => {
    if (!newEntry.word.trim()) return;

    setIsAiLoading(true);
    try {
      const results = await api.analyzeText(newEntry.word);
      if (results.length > 0) {
        // Ensure that the results from the API conform to the expected type
        // by providing default values for missing properties.
        const formattedResults = results.map(result => ({
          word: result.word || '',
          reading: result.reading || '',
          translation: result.translation || '',
          pronunciation: result.pronunciation || '',
          exampleSentence: result.exampleSentence || '',
          type: result.type || WordType.NOUN,
          difficulty: result.difficulty || DifficultyLevel.BEGINNER,
          status: result.status || StudyStatus.NEW, notes: result.notes || '' }));
        onAddMultiple(formattedResults);
        // Clear the input and hide the new row form
        setShowNewRow(false);
        setNewEntry({ word: '', reading: '', translation: '', pronunciation: '', exampleSentence: '', type: WordType.NOUN, difficulty: DifficultyLevel.BEGINNER, status: StudyStatus.NEW, notes: '' });
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      // You could add a toast notification here to inform the user of the failure.
    } finally {
      setIsAiLoading(false);
    }
  };
  const renderBadgeCell = (entry: VocabularyEntry, field: keyof VocabularyEntry, value: any) => {
    const isEditing = editingCell?.rowId === entry.id && editingCell?.field === field

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
          onValueChange={(val) => handleDropdownChange(val, entry.id, field)}
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

      if (field === "type") return renderSelect(WordType);
      if (field === "difficulty") return renderSelect(DifficultyLevel);
      if (field === "status") return renderSelect(StudyStatus);
    }

    // Render colored badges for non-editing state
    let badgeColor = ""
    let displayValue = String(value)

    if (field === "status" && value) {
      badgeColor = getStatusColor(value as StudyStatus)
      displayValue = formatEnumValue(value)
    } else if (field === "difficulty" && value) {
      badgeColor = getDifficultyColor(value)
      displayValue = formatEnumValue(value)
    } else if (field === "type" && value) {
      badgeColor = getTypeColor(value as WordType)
      displayValue = formatEnumValue(value)
    }

    return (
      <Badge
        className={`cursor-pointer hover:opacity-80 ${badgeColor}`}
        onClick={() => handleCellClick(entry.id, field, value)}
      >
        {displayValue}
      </Badge>
    )
  }

  const renderEditableCell = (entry: VocabularyEntry, field: keyof VocabularyEntry, value: any) => {
    const isEditing = editingCell?.rowId === entry.id && editingCell?.field === field

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
      )
    }

    return (
      <div
        className="cursor-pointer hover:bg-muted/50 p-1 rounded min-h-[2rem] flex items-center"
        onClick={() => handleCellClick(entry.id, field, value)}
      >
        {String(value)}
      </div>
    )
  }

  const getStatusColor = (status: StudyStatus) => {
    switch (status) {
      case StudyStatus.MASTERED:
        return "bg-green-600 text-white dark:bg-green-700 dark:text-white"
      case StudyStatus.REVIEWING:
        return "bg-blue-600 text-white dark:bg-blue-700 dark:text-white"
      case StudyStatus.LEARNING:
        return "bg-orange-600 text-white dark:bg-orange-700 dark:text-white"
      case StudyStatus.NEW:
        return "bg-slate-600 text-white dark:bg-slate-700 dark:text-white"
      default:
        return "bg-slate-600 text-white dark:bg-slate-700 dark:text-white"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-emerald-600 text-white dark:bg-emerald-700 dark:text-white"
      case "intermediate":
        return "bg-orange-600 text-white dark:bg-orange-700 dark:text-white"
      case "advanced":
        return "bg-red-600 text-white dark:bg-red-700 dark:text-white"
      default:
        return "bg-slate-600 text-white dark:bg-slate-700 dark:text-white"
    }
  }

  const getTypeColor = (type: WordType) => {
    switch (type) {
      case "noun":
        return "bg-blue-600 text-white dark:bg-blue-700 dark:text-white"
      case "verb":
        return "bg-purple-600 text-white dark:bg-purple-700 dark:text-white"
      case "adjective":
        return "bg-pink-600 text-white dark:bg-pink-700 dark:text-white"
      case "adverb":
        return "bg-indigo-600 text-white dark:bg-indigo-700 dark:text-white"
      case "particle":
        return "bg-teal-600 text-white dark:bg-teal-700 dark:text-white"
      case "conjunction":
        return "bg-cyan-600 text-white dark:bg-cyan-700 dark:text-white"
      case "interjection":
        return "bg-rose-600 text-white dark:bg-rose-700 dark:text-white"
      case "counter":
        return "bg-violet-600 text-white dark:bg-violet-700 dark:text-white"
      case "expression":
        return "bg-lime-600 text-white dark:bg-lime-700 dark:text-white"
      default:
        return "bg-slate-600 text-white dark:bg-slate-700 dark:text-white"
    }
  }

  const uniqueTypes = [...new Set(entries.map((e) => e.type))].filter(Boolean)

  if (entries.length === 0 && !showNewRow) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No vocabulary entries yet.</p>
        <p className="text-muted-foreground mb-4">Add your first Japanese word to get started!</p>
        <Button onClick={() => setShowNewRow(true)} className="flex items-center gap-2 mx-auto">
          <Plus className="h-4 w-4" />
          Add First Word
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      {/* Filters and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search words, readings, translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterType} onValueChange={(value) => setFilterType(value as WordType | "all")}>
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

        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as StudyStatus | "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(StudyStatus).map((status) => (
              <SelectItem key={status} value={status}>{formatEnumValue(status)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => setShowNewRow(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Word
        </Button>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredEntries.length} of {entries.length} entries
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-semibold">Word</th>
              <th className="text-left p-3 font-semibold">Reading</th>
              <th className="text-left p-3 font-semibold">Translation</th>
              <th className="text-left p-3 font-semibold">Pronunciation</th>
              <th className="text-left p-3 font-semibold">Example</th>
              <th className="text-left p-3 font-semibold">Notes</th>
              <th className="text-left p-3 font-semibold">Type</th>
              <th className="text-left p-3 font-semibold">Difficulty</th>
              <th className="text-left p-3 font-semibold">Status</th>
              <th className="text-left p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {showNewRow && (
              <tr className="border-b bg-muted/20">
                <td className="p-3" colSpan={9}>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newEntry.word}
                      onChange={(e) => setNewEntry({ ...newEntry, word: e.target.value })}
                      onKeyDown={handleNewEntryKeyDown}
                      placeholder="Enter word or sentence..."
                      className="h-8 flex-grow"
                    />
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 w-20 whitespace-nowrap text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                      onClick={handleAiFill}
                      disabled={isAiLoading}
                    >
                      {isAiLoading ? <Sparkles className="h-4 w-4 animate-pulse" /> : 'AI Save'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowNewRow(false)}>
                      Cancel
                    </Button>
                  </div>
                </td>
              </tr>
            )}

            {filteredEntries.map((entry, index) => (
              <tr
                key={entry.id}
                data-row-id={entry.id}
                className={`border-b hover:bg-muted/50 ${index % 2 === 0 ? "bg-card" : "bg-background"}`}
                tabIndex={0}
              >
                <td className="p-3">
                  <div className="font-medium text-lg">{renderEditableCell(entry, "word", entry.word)}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{renderEditableCell(entry, "reading", entry.reading)}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{renderEditableCell(entry, "translation", entry.translation)}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm font-mono">
                    {renderEditableCell(entry, "pronunciation", entry.pronunciation)}
                  </div>
                </td>
                <td className="p-3 max-w-xs">
                  <div className="text-sm">{renderEditableCell(entry, "exampleSentence", entry.exampleSentence)}</div>
                </td>
                <td className="p-3 max-w-xs">
                  <div className="text-sm">{renderEditableCell(entry, "notes", entry.notes)}</div>
                </td>
                <td className="p-3">{renderBadgeCell(entry, "type", entry.type)}</td>
                <td className="p-3">{renderBadgeCell(entry, "difficulty", entry.difficulty)}</td>
                <td className="p-3">{renderBadgeCell(entry, "status", entry.status)}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(entry.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEntries.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No entries match your search criteria.</p>
        </div>
      )}
    </div>
  )
}
