import type { GyeolContent } from "../_lib/types";

export const rarityContent = {
  grades: {
    1: {
      description: "結タレモデル基準でかなり珍しい会話の組み合わせです。複数の軸で強いサインが重なっています。",
      label: "1等級",
      mountainLabel: "とても珍しい組み合わせ",
    },
    2: {
      description: "よくある流れから少し外れた組み合わせです。ふたりだけのリズムがかなりはっきりしています。",
      label: "2等級",
      mountainLabel: "珍しい組み合わせ",
    },
    3: {
      description: "個性がよく見える組み合わせです。なじみの会話の中に特別なパターンがあります。",
      label: "3等級",
      mountainLabel: "個性的な組み合わせ",
    },
    4: {
      description: "中央に近いバランス型です。安定した流れと小さな変化が一緒に見えます。",
      label: "4等級",
      mountainLabel: "バランス型",
    },
    5: {
      description: "多くのカップルに見られる心地よい組み合わせです。慣れた会話が関係を支えています。",
      label: "5等級",
      mountainLabel: "心地よい組み合わせ",
    },
    6: {
      description: "予測しやすい流れが多い組み合わせです。珍しさより安定感が先に見えます。",
      label: "6等級",
      mountainLabel: "安定型",
    },
    7: {
      description: "もっとも日常的な組み合わせです。珍しくなくても、長く使える会話習慣があります。",
      label: "7等級",
      mountainLabel: "日常型",
    },
  },
  metadata: {
    description: "ファイルアップロードなしで、16個の選択からふたりの会話希少度と安全な共有カードを確認できます。",
    title: "会話希少度ランキング - 結タレ",
  },
  questions: [
    {
      id: "duration",
      options: [
        { id: "duration-new", label: "まだお互いの話し方を知っている途中です" },
        { id: "duration-seasonal", label: "いくつかの季節を過ごしてリズムができました" },
        { id: "duration-long", label: "長く積もった場面や合言葉が多いです" },
      ],
      question: "ふたりの会話はどのくらい積み重なっていますか？",
    },
    {
      id: "frequency",
      options: [
        { id: "frequency-daily", label: "ほぼ毎日自然につながります" },
        { id: "frequency-steady", label: "無理のない安定した間隔があります" },
        { id: "frequency-event", label: "必要な時やイベントの時に一気に生きます" },
      ],
      question: "会話の頻度はどれに近いですか？",
    },
    {
      id: "replyRhythm",
      options: [
        { id: "reply-fast", label: "思いついたらすぐ送り、流れを作ります" },
        { id: "reply-slow", label: "ゆっくり返しても途切れにくいです" },
        { id: "reply-asymmetric", label: "片方が始め、もう片方が深めます" },
      ],
      question: "返信リズムはどんな形ですか？",
    },
    {
      id: "planning",
      options: [
        { id: "plans-flexible", label: "即興と計画を状況に合わせて混ぜます" },
        { id: "plans-planned", label: "予定とコンディションを先に合わせると安心します" },
        { id: "plans-drifting", label: "その場の流れで進み、時々ずれます" },
      ],
      question: "デートや休みの日はどう決めますか？",
    },
    {
      id: "changeResponse",
      options: [
        { id: "change-fast", label: "予定が変わるとすぐ方向を変えます" },
        { id: "change-cautious", label: "少し様子を見てからゆっくり調整します" },
        { id: "change-role-split", label: "片方が動き、片方が整えて合わせます" },
      ],
      question: "急に予定が変わるとどうなりますか？",
    },
    {
      id: "expression",
      options: [
        { id: "expression-direct", label: "好き嫌いを比較的はっきり言います" },
        { id: "expression-subtle", label: "言葉より雰囲気や行動で見せます" },
        { id: "expression-mixed", label: "直接の言葉にふたりだけのサインを混ぜます" },
      ],
      question: "愛情表現はどちらに近いですか？",
    },
    {
      id: "reassurance",
      options: [
        { id: "reassurance-clear", label: "はっきり言ってもらうと一番安心します" },
        { id: "reassurance-subtle", label: "小さな行動や雰囲気でも十分伝わります" },
        { id: "reassurance-awkward", label: "気持ちはあっても表現のタイミングを逃すことがあります" },
      ],
      question: "安心したい時に一番通じる方法は？",
    },
    {
      id: "support",
      options: [
        { id: "support-listen", label: "最後まで聞いて気持ちを分かってくれると助かります" },
        { id: "support-practical", label: "実際に役立つ行動をしてくれると心強いです" },
        { id: "support-light", label: "軽い冗談や切り替えで少し楽になります" },
      ],
      question: "つらい日に一番必要な反応は？",
    },
    {
      id: "repair",
      options: [
        { id: "repair-fast", label: "誤解は早めに確認すると安心します" },
        { id: "repair-cooldown", label: "少し冷ましてから落ち着いて戻ります" },
        { id: "repair-comeback", label: "途切れても不思議とまたつながります" },
      ],
      question: "小さな誤解はどう回復しますか？",
    },
    {
      id: "apology",
      options: [
        { id: "apology-fast", label: "短くても早く謝るとほどけます" },
        { id: "apology-action", label: "言葉より変わった行動が見えると信じられます" },
        { id: "apology-miss", label: "タイミングを逃して後でぎこちなくなることがあります" },
      ],
      question: "謝ることはどう扱いますか？",
    },
    {
      id: "stress",
      options: [
        { id: "stress-share", label: "つらいことを比較的よく共有します" },
        { id: "stress-quiet", label: "それぞれ整理してから必要な分だけ話します" },
        { id: "stress-bounce", label: "重くなる前に空気を変えます" },
      ],
      question: "ストレスが大きい時の距離感は？",
    },
    {
      id: "privateSignals",
      options: [
        { id: "signals-many", label: "あだ名、ミーム、絵文字などのサインが多いです" },
        { id: "signals-some", label: "たまに通じる冗談や口調があります" },
        { id: "signals-few", label: "特別な合言葉より日常会話が楽です" },
      ],
      question: "ふたりだけのサインはどのくらいありますか？",
    },
    {
      id: "memory",
      options: [
        { id: "memory-exact", label: "最初の場面や特定の会話をかなり覚えています" },
        { id: "memory-vibe", label: "正確な日付より、その時の雰囲気が残ります" },
        { id: "memory-now", label: "過去より今の会話が大切です" },
      ],
      question: "長く残る場面はどう記憶されていますか？",
    },
    {
      id: "balance",
      options: [
        { id: "balance-similar", label: "話し方や速度がだんだん似てきました" },
        { id: "balance-complementary", label: "違うからこそ足りない部分を埋めます" },
        { id: "balance-volatile", label: "良い日とずれる日の温度差が大きいです" },
      ],
      question: "ふたりの会話バランスはどうですか？",
    },
    {
      id: "decision",
      options: [
        { id: "decision-together", label: "大事な選択は一緒に基準を合わせます" },
        { id: "decision-alternate", label: "状況に応じて自然に主導を交代します" },
        { id: "decision-one-sided", label: "片方が多く決め、もう片方が合わせることが多いです" },
      ],
      question: "大事な選択をする時のバランスは？",
    },
    {
      id: "space",
      options: [
        { id: "space-close", label: "よく近くにいるほど安心します" },
        { id: "space-respecting", label: "それぞれの時間も尊重されると強くなります" },
        { id: "space-uneven", label: "望む距離が違って調整が必要な時があります" },
      ],
      question: "それぞれの時間はどう置いていますか？",
    },
  ],
  results: {
    archive: {
      mission: "まだ覚えている最初の場面をひとつ話し、その頃と変わった点を一文で伝えてみましょう。",
      nickname: "場面保管型",
      reasons: [
        "長く残る場面が関係の基準になります。",
        "特定の言葉や瞬間をはっきり覚えています。",
        "積み重ねた会話がふたりの年表のように働きます。",
      ],
      summary: "ふたりの会話は、過ぎた場面をそのまま流さないタイプです。昔の言葉や瞬間が今の会話を支えています。",
    },
    harbor: {
      mission: "今日は結論を急がず、お互いに心地よかった会話の仕方をひとつ話してみましょう。",
      nickname: "安定港型",
      reasons: [
        "速い刺激より安定感を大きく使います。",
        "返信がゆっくりでも関係が切れにくいです。",
        "違いを役割のように受け止めます。",
      ],
      summary: "ふたりの会話には戻れる場所があります。劇的でなくても、長く留まれる力があります。",
    },
    orbit: {
      mission: "よく繰り返す挨拶や口癖をひとつ選び、なぜなじんだのか話してみましょう。",
      nickname: "毎日軌道型",
      reasons: [
        "自然な反復が関係のリズムを作ります。",
        "大きなイベントより日常の中で会話が生きます。",
        "似てくる言葉が安心のサインになります。",
      ],
      summary: "ふたりの会話は毎日の小さな反復で近づきます。特別な一撃より、回り続ける軌道が魅力です。",
    },
    rare: {
      mission: "今日はふたりだけのサインひとつと、本当の気持ちひとつを軽く、でもはっきり送ってみましょう。",
      nickname: "希少整列型",
      reasons: [
        "複数の軸で強い会話サインが同時に出ています。",
        "日常性、合言葉、回復リズムが同じ方向に並びます。",
        "よくある型ひとつでは説明しにくい組み合わせです。",
      ],
      summary:
        "ふたりの会話は結タレモデル基準でかなり珍しい組み合わせです。単なるタイプより、ふたりだけの文法に近いです。",
    },
    reconnect: {
      mission: "最近ずれたあとに戻れた瞬間を思い出し、効いた一文をもう一度使ってみましょう。",
      nickname: "再接続回復型",
      reasons: [
        "止まった流れをもう一度つなげる力があります。",
        "誤解を放置せず確認したり戻ったりします。",
        "違う速度も回復の材料に変えます。",
      ],
      summary: "ふたりの会話はいつも滑らかではなくても、またつながる力があります。大切なのは再び話しかける方法です。",
    },
    signal: {
      mission: "ふたりだけが分かる表現をひとつ選び、今日はその意味を少し優しく言葉にしてみましょう。",
      nickname: "暗号サイン型",
      reasons: [
        "直接言わなくても通じるサインが多いです。",
        "口調、絵文字、冗談が感情の印になります。",
        "軽く見える会話の内側に濃い意味があります。",
      ],
      summary: "外から見ると普通でも、ふたりにははっきりしたサインが多い会話です。希少度はその解釈から生まれます。",
    },
    spark: {
      mission: "急に浮かんだ言葉をひとつ送り、最後は相手が楽に返せる余白を残してみましょう。",
      nickname: "即興火花型",
      reasons: [
        "思いついた瞬間に会話が生きる力があります。",
        "大きな計画より小さな火種が関係を動かします。",
        "今の感情と反応が会話の中心に近いです。",
      ],
      summary: "ふたりの会話は長く準備するより瞬間の火花で生きます。軽い始まりが意外と長い場面につながります。",
    },
  },
  ui: {
    answeredCount: "{count}/{total} 回答",
    backButton: "前へ",
    copyFallbackButton: "リンクをコピー",
    copiedFeedback: "共有リンクをコピーしました。",
    emptyResultDescription: "共有リンクの形式が正しくありません。もう一度入力すると新しい結果を作れます。",
    emptyResultTitle: "もう一度計算しますか？",
    gradeTitle: "会話希少度等級",
    heroCta: "会話等級を確認する",
    heroDescription: "ファイルをアップロードせず、16個の選択だけでふたりの会話が何等級なのかすぐ確認できます。",
    heroEyebrow: "ファイルなしで見る会話希少度",
    heroSecondaryCta: "計算方法を見る",
    heroTitle: "ふたりの会話は何等級？",
    indexLabel: "希少度指数",
    introNote: "1分ほどで結果カードまで作れます。",
    missionTitle: "今日の会話ミッション",
    modelStepGradeBody: "実ユーザー順位のようには言わず、結タレモデル基準の珍しい組み合わせとしてだけ表現します。",
    modelStepGradeTitle: "モデル基準等級",
    modelStepInputBody: "関係期間、会話頻度、支え方、回復リズムなど、すぐ選べる質問だけを使います。",
    modelStepInputTitle: "簡単入力",
    modelStepShareBody: "等級、ニックネーム、一言要約をカードにして、気軽に送れる形にします。",
    modelStepShareTitle: "結果カード",
    modelNotice: "回答の組み合わせを結タレモデル基準で読んだランキングです。",
    nextButton: "次の質問",
    questionEyebrow: "簡単入力",
    reasonsTitle: "この等級になった理由",
    resultButton: "結果を見る",
    resultEyebrow: "会話希少度結果",
    restartButton: "もう一度",
    resultCardBody: "等級、ニックネーム、一言要約をカードのようにまとめました。リンクやスクショで気軽に送れます。",
    resultCardTitle: "送ってみたい結果カード",
    shareButton: "結果を共有",
    shareFallbackBody: "{grade} · {nickname} · 希少度指数 {index}",
    shareLead: "結タレモデル基準",
    shareTitle: "ふたりの会話希少度結果",
  },
} as const satisfies GyeolContent;
