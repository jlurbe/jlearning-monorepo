import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const KATAKANA_TABLE = [
  ['ア', 'イ', 'ウ', 'エ', 'オ'],
  ['カ', 'キ', 'ク', 'ケ', 'コ'],
  ['サ', 'シ', 'ス', 'セ', 'ソ'],
  ['タ', 'チ', 'ツ', 'テ', 'ト'],
  ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
  ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
  ['マ', 'ミ', 'ム', 'メ', 'モ'],
  ['ヤ', '', 'ユ', '', 'ヨ'],
  ['ラ', 'リ', 'ル', 'レ', 'ロ'],
  ['ワ', '', 'ヲ', '', 'ン'],
];

const ROW_LABELS = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa'];
const COL_LABELS = ['a', 'i', 'u', 'e', 'o'];

export default function KatakanaPage() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Katakana Alphabet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full text-center">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  {COL_LABELS.map((col) => (
                    <th key={col} className="p-2 font-bold uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KATAKANA_TABLE.map((row, i) => (
                  <tr key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'backwards' }}>
                    <td className="p-2 font-bold uppercase">{ROW_LABELS[i]}</td>
                    {row.map((char, j) => (
                      <td
                        key={j}
                        className="p-2 text-2xl border border-gray-200 hover:bg-primary/10 hover:scale-110 transition-all duration-200 cursor-pointer"
                      >
                        {char || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
