import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-medium text-primary">404</p>
      <h1 className="mt-4 font-display text-xl font-medium text-foreground">
        Страницата не е намерена
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Възможно е връзката да е остаряла или страницата да е преместена.
      </p>
      <Button href="/" className="mt-8">
        Обратно към началото
      </Button>
    </div>
  );
}
