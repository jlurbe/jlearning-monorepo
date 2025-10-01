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

const KATAKANA_DAKUTEN_TABLE = [
  ['ガ', 'ギ', 'グ', 'ゲ', 'ゴ'],
  ['ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'],
  ['ダ', 'ヂ', 'ヅ', 'デ', 'ド'],
  ['バ', 'ビ', 'ブ', 'ベ', 'ボ'],
  ['パ', 'ピ', 'プ', 'ペ', 'ポ'],
];

const KATAKANA_SMALL_TABLE = [['ャ', 'ュ', 'ョ'], ['ッ']];

const KATAKANA_COMBINATIONS_TABLE = [
  ['キャ', 'キュ', 'キョ'],
  ['シャ', 'シュ', 'ショ'],
  ['チャ', 'チュ', 'チョ'],
  ['ニャ', 'ニュ', 'ニョ'],
  ['ヒャ', 'ヒュ', 'ヒョ'],
  ['ミャ', 'ミュ', 'ミョ'],
  ['リャ', 'リュ', 'リョ'],
  ['ギャ', 'ギュ', 'ギョ'],
  ['ジャ', 'ジュ', 'ジョ'],
  ['ビャ', 'ビュ', 'ビョ'],
  ['ピャ', 'ピュ', 'ピョ'],
];

const ROW_LABELS = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa'];
const DAKUTEN_ROW_LABELS = ['ga', 'za', 'da', 'ba', 'pa'];
const COMBINATION_ROW_LABELS = [
  'kya',
  'sha',
  'cha',
  'nya',
  'hya',
  'mya',
  'rya',
  'gya',
  'ja',
  'bya',
  'pya',
];
const COL_LABELS = ['a', 'i', 'u', 'e', 'o'];

export default function KatakanaPage() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Katakana Alphabet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Basic Katakana */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Katakana</h3>
            <div className="overflow-hidden rounded-lg">
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
                    <tr
                      key={i}
                      className="animate-fade-in"
                      style={{
                        animationDelay: `${i * 0.05}s`,
                        animationFillMode: 'backwards',
                      }}
                    >
                      <td className="p-2 font-bold uppercase">
                        {ROW_LABELS[i]}
                      </td>
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
          </div>

          {/* Dakuten Katakana */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dakuten & Handakuten</h3>
            <div className="overflow-hidden rounded-lg">
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
                  {KATAKANA_DAKUTEN_TABLE.map((row, i) => (
                    <tr
                      key={i}
                      className="animate-fade-in"
                      style={{
                        animationDelay: `${(i + 10) * 0.05}s`,
                        animationFillMode: 'backwards',
                      }}
                    >
                      <td className="p-2 font-bold uppercase">
                        {DAKUTEN_ROW_LABELS[i]}
                      </td>
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
          </div>

          {/* Small Characters */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Small Characters</h3>
            <div className="overflow-hidden rounded-lg">
              <table className="table-auto border-collapse w-full text-center">
                <thead>
                  <tr>
                    <th className="p-2">Small ya</th>
                    <th className="p-2">Small yu</th>
                    <th className="p-2">Small yo</th>
                    <th className="p-2">Small tsu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className="animate-fade-in"
                    style={{
                      animationDelay: `${15 * 0.05}s`,
                      animationFillMode: 'backwards',
                    }}
                  >
                    <td className="p-2 text-2xl border border-gray-200 hover:bg-primary/10 hover:scale-110 transition-all duration-200 cursor-pointer">
                      {KATAKANA_SMALL_TABLE[0][0]}
                    </td>
                    <td className="p-2 text-2xl border border-gray-200 hover:bg-primary/10 hover:scale-110 transition-all duration-200 cursor-pointer">
                      {KATAKANA_SMALL_TABLE[0][1]}
                    </td>
                    <td className="p-2 text-2xl border border-gray-200 hover:bg-primary/10 hover:scale-110 transition-all duration-200 cursor-pointer">
                      {KATAKANA_SMALL_TABLE[0][2]}
                    </td>
                    <td className="p-2 text-2xl border border-gray-200 hover:bg-primary/10 hover:scale-110 transition-all duration-200 cursor-pointer">
                      {KATAKANA_SMALL_TABLE[1][0]}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Combination Characters */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Combination Characters
            </h3>
            <div className="overflow-hidden rounded-lg">
              <table className="table-auto border-collapse w-full text-center">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    <th className="p-2">ya</th>
                    <th className="p-2">yu</th>
                    <th className="p-2">yo</th>
                  </tr>
                </thead>
                <tbody>
                  {KATAKANA_COMBINATIONS_TABLE.map((row, i) => (
                    <tr
                      key={i}
                      className="animate-fade-in"
                      style={{
                        animationDelay: `${(i + 16) * 0.05}s`,
                        animationFillMode: 'backwards',
                      }}
                    >
                      <td className="p-2 font-bold uppercase">
                        {COMBINATION_ROW_LABELS[i]}
                      </td>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
