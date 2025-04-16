import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, FileText, Key, Lock, Settings, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">AI Page Summarizer</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Расширение Chrome для создания кратких содержаний веб-страниц с использованием AI (OpenRouter API).
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="px-8">
                  <Link href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
                    Установить расширение
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/instructions">Инструкция по использованию</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-[300px] overflow-hidden rounded-xl border bg-background shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/50 to-background/80 p-6 flex flex-col justify-end">
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl">Мгновенное саммари</h3>
                    <p className="text-sm text-muted-foreground">
                      Получите краткое содержание любой веб-страницы в один клик
                    </p>
                  </div>
                </div>
                <Image
                  src="/placeholder.svg?height=350&width=300"
                  width={300}
                  height={350}
                  alt="Скриншот расширения"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Особенности расширения</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Наше расширение предлагает множество функций для удобного создания саммари
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <BrainCircuit className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Несколько AI-моделей</CardTitle>
                <CardDescription>Поддержка Llama, DeepSeek, Gemini, Qwen и других моделей</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Выбирайте модель, которая лучше всего подходит для ваших задач и получайте оптимальные результаты
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <FileText className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Гибкая детализация</CardTitle>
                <CardDescription>Настраивайте уровень детализации саммари</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Получайте краткие или подробные саммари в зависимости от ваших потребностей
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Settings className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Фоновая обработка</CardTitle>
                <CardDescription>Работает даже при закрытом popup</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Закройте popup и продолжайте работу - процесс генерации не прервется
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Lock className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Безопасность</CardTitle>
                <CardDescription>Ваш API-ключ хранится только локально</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ключ не попадает в публичный репозиторий и не используется в коде напрямую
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Key className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Простая настройка</CardTitle>
                <CardDescription>Легкая настройка API-ключа</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Получите ключ на OpenRouter и введите его в настройках расширения
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Sparkles className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Удобный интерфейс</CardTitle>
                <CardDescription>Интуитивно понятный UI</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Выбор модели, настройка ключа, копирование результата - всё в одном месте
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Как это работает</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Создание саммари в несколько простых шагов
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-bold">Установите расширение</h3>
              <p className="text-muted-foreground">
                Загрузите и установите расширение из Chrome Web Store или в режиме разработчика
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-bold">Настройте API-ключ</h3>
              <p className="text-muted-foreground">Получите ключ на OpenRouter и введите его в настройках расширения</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-bold">Создавайте саммари</h3>
              <p className="text-muted-foreground">
                Нажмите на иконку расширения на любой странице и получите краткое содержание
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Готовы сэкономить время на чтении?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Установите AI Page Summarizer прямо сейчас и получайте краткое содержание любой веб-страницы в один клик
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="px-8">
                <Link href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
                  Установить расширение
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/instructions">Узнать больше</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
