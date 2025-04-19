import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function WhatsNew() {
  return (
    <div className="flex flex-col items-center py-12">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle>Что нового</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Добавлены новые функции для удобства использования расширения.</li>
            <li>Улучшена производительность и стабильность.</li>
            <li>Исправлены мелкие ошибки.</li>
          </ul>
          <div className="mt-6 text-center">
            <Link href="/" className="underline text-blue-600">На главную</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
