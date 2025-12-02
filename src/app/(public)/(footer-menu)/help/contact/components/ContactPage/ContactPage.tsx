"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Send, ArrowLeft, Paperclip, X } from "lucide-react";

// お問い合わせカテゴリ
const contactCategories = [
  { value: "bug", label: "不具合報告" },
  { value: "account", label: "アカウントについて" },
  { value: "report", label: "違反報告" },
  { value: "feedback", label: "ご意見・ご要望" },
  { value: "other", label: "その他" },
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...files].slice(0, 3)); // 最大3ファイル
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // 模擬的な送信処理
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">送信完了</h2>
            <p className="text-muted-foreground">
              お問い合わせを受け付けました。
              <br />
              確認メールを送信しましたので、ご確認ください。
            </p>
            <p className="text-sm text-muted-foreground">
              通常3営業日以内にご返信いたします。
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">お問い合わせ</h1>
          <p className="text-muted-foreground">
            ご質問やご要望がございましたら、以下のフォームよりお気軽にお問い合わせください。
          </p>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>お問い合わせフォーム</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* お名前 */}
              <div className="space-y-2">
                <Label htmlFor="name">お名前 *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="山田 太郎"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* メールアドレス */}
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  ご返信先となりますので、正確にご入力ください。
                </p>
              </div>

              {/* カテゴリ */}
              <div className="space-y-2">
                <Label htmlFor="category">カテゴリ *</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 件名 */}
              <div className="space-y-2">
                <Label htmlFor="subject">件名 *</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="お問い合わせの概要"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* 本文 */}
              <div className="space-y-2">
                <Label htmlFor="message">本文 *</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="お問い合わせ内容を詳しくお書きください"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* 添付ファイル */}
              <div className="space-y-2">
                <Label>添付ファイル（任意）</Label>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md text-sm"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {attachments.length < 3 && (
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      ファイルを添付
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      画像のみ、最大3ファイルまで
                    </p>
                  </div>
                )}
              </div>

              {/* 送信ボタン */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  キャンセル
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "送信中..." : "送信する"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
