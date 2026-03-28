"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);

    if (result.error) {
      setError(t("errors.invalidCredentials"));
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("loginTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">{t("loginSubtitle")}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                aria-invalid={errors.email ? "true" : "false"}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{t("errors.invalidCredentials")}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("password")}</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                disabled={isLoading}
                aria-invalid={errors.password ? "true" : "false"}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{t("errors.invalidCredentials")}</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("common.loading") : t("loginButton")}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("common.or")}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {t("loginWithGoogle")}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGitHubSignIn}
              disabled={isLoading}
            >
              {t("loginWithGitHub")}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link href="/signup" className="text-primary hover:underline">
              {t("signupButton")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
