---
applyTo: "**"
---

Serena Scan (2025-12-02):
- 概要: UI（Profiles, Organizations, Nations, Matching）は実装済みで、関連単体テストは概ねパス済。
- DB統合テスト: 多数あり（RUN_DB_TESTS=1 で実行）。ローカルで再現・検証が必要。以前のメモにある「users INSERT でのトランザクションエラー」は現時点で未再現。
- 未完了: Task 3.3 (コミュニティ CRUD)、ドキュメント整合化が必要。

次のアクション: 1) RUN_DB_TESTS=1 で integration 実行→問題再現・修正 2) Task3.3 実装 3) 実装/設計ドキュメント整合