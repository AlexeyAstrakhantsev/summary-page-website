import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function Welcome() {
  return (
    <div className="flex flex-col items-center py-12">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle>Добро пожаловать!</CardTitle>
          <CardDescription>Спасибо за установку расширения "AI Page Summarizer".</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Используйте расширение для создания кратких содержаний веб-страниц одним кликом.</li>
            <li>Откройте нужную страницу и нажмите на иконку расширения.</li>
            <li>Результат появится мгновенно!</li>
          </ul>
          <div className="mt-6 text-center">
            <Link href="/instructions" className="underline text-blue-600">Инструкция по использованию</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
