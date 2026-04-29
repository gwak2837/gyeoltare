import type { GyeolContent } from "../_lib/types";

export const rarityContent = {
  grades: {
    1: {
      description: "按结线模型来看，这是很少见的聊天组合，多个维度同时出现了强信号。",
      label: "1级",
      mountainLabel: "非常少见的组合",
    },
    2: {
      description: "这是稍微偏离常见节奏的组合，两个人才懂的聊天节奏比较清晰。",
      label: "2级",
      mountainLabel: "少见组合",
    },
    3: {
      description: "这是很有个性的组合，熟悉的情侣聊天里混着特别的模式。",
      label: "3级",
      mountainLabel: "个性组合",
    },
    4: {
      description: "这是接近中间的平衡型组合，稳定的流动和小变化同时存在。",
      label: "4级",
      mountainLabel: "平衡组合",
    },
    5: {
      description: "这是很多情侣都会有的舒服组合，熟悉感支撑着关系。",
      label: "5级",
      mountainLabel: "舒服组合",
    },
    6: {
      description: "这是比较容易预测的组合，比起稀有，稳定感更先被看见。",
      label: "6级",
      mountainLabel: "稳定组合",
    },
    7: {
      description: "这是最日常的组合。虽然不稀有，但有很多适合长期相处的聊天习惯。",
      label: "7级",
      mountainLabel: "日常组合",
    },
  },
  metadata: {
    description: "不用上传聊天文件，只用 16 个选择题查看两个人的聊天稀有度、等级和安全分享卡。",
    title: "聊天稀有度排行 - 结线",
  },
  questions: [
    {
      id: "duration",
      options: [
        { id: "duration-new", label: "我们还在熟悉彼此的说话方式" },
        { id: "duration-seasonal", label: "一起经过几个季节后有了节奏" },
        { id: "duration-long", label: "有很多累积下来的场景和暗号" },
      ],
      question: "你们的聊天积累到什么程度了？",
    },
    {
      id: "frequency",
      options: [
        { id: "frequency-daily", label: "几乎每天都会自然接上" },
        { id: "frequency-steady", label: "有不勉强但稳定的间隔" },
        { id: "frequency-event", label: "在需要或有计划时会突然热起来" },
      ],
      question: "聊天频率更接近哪一种？",
    },
    {
      id: "replyRhythm",
      options: [
        { id: "reply-fast", label: "想到就很快发出去，带起对话" },
        { id: "reply-slow", label: "回复慢一点也不容易断掉" },
        { id: "reply-asymmetric", label: "一方先开启，另一方负责加深" },
      ],
      question: "回复节奏是什么形状？",
    },
    {
      id: "planning",
      options: [
        { id: "plans-flexible", label: "会根据情况混合即兴和计划" },
        { id: "plans-planned", label: "提前对好时间和状态会更安心" },
        { id: "plans-drifting", label: "常常顺着当下走，偶尔会错位" },
      ],
      question: "约会或休息日通常怎么安排？",
    },
    {
      id: "changeResponse",
      options: [
        { id: "change-fast", label: "计划有变就马上换方向" },
        { id: "change-cautious", label: "先观察一下，再慢慢调整" },
        { id: "change-role-split", label: "一方先动，另一方负责整理落点" },
      ],
      question: "突然有变化时你们会怎样？",
    },
    {
      id: "expression",
      options: [
        { id: "expression-direct", label: "喜欢和不喜欢会说得比较清楚" },
        { id: "expression-subtle", label: "比起语言，更常用气氛和行动表达" },
        { id: "expression-mixed", label: "直接表达里也会混入两个人的信号" },
      ],
      question: "表达喜欢时更像哪一种？",
    },
    {
      id: "reassurance",
      options: [
        { id: "reassurance-clear", label: "说清楚会最有安全感" },
        { id: "reassurance-subtle", label: "小动作和氛围也足够感受到" },
        { id: "reassurance-awkward", label: "心意是有的，但常常错过表达时机" },
      ],
      question: "需要确认时，哪种方式最有效？",
    },
    {
      id: "support",
      options: [
        { id: "support-listen", label: "被完整听完、被理解会最有力量" },
        { id: "support-practical", label: "马上帮上忙的行动会最踏实" },
        { id: "support-light", label: "轻松的玩笑或转场会让人喘口气" },
      ],
      question: "难过的一天最需要对方怎样回应？",
    },
    {
      id: "repair",
      options: [
        { id: "repair-fast", label: "误会要早点确认才安心" },
        { id: "repair-cooldown", label: "先冷静一下，再慢慢对齐" },
        { id: "repair-comeback", label: "就算中断，也总会奇妙地重新接上" },
      ],
      question: "出现小误会时通常怎么恢复？",
    },
    {
      id: "apology",
      options: [
        { id: "apology-fast", label: "哪怕很短，早点说抱歉就会松动" },
        { id: "apology-action", label: "比起话语，更需要看到改变的行动" },
        { id: "apology-miss", label: "有时会错过时机，之后变得有点尴尬" },
      ],
      question: "你们通常怎么处理道歉？",
    },
    {
      id: "stress",
      options: [
        { id: "stress-share", label: "比较能把辛苦的事说给彼此听" },
        { id: "stress-quiet", label: "各自整理好后，只分享需要的部分" },
        { id: "stress-bounce", label: "变得太沉重前，会先换个气氛" },
      ],
      question: "压力变大时，两个人的距离是？",
    },
    {
      id: "privateSignals",
      options: [
        { id: "signals-many", label: "昵称、梗、表情符号等两个人的信号很多" },
        { id: "signals-some", label: "偶尔有能互相懂的语气或玩笑" },
        { id: "signals-few", label: "比起暗号，日常聊天更舒服" },
      ],
      question: "两个人专属的信号有多少？",
    },
    {
      id: "memory",
      options: [
        { id: "memory-exact", label: "第一次场景或某段聊天记得比较清楚" },
        { id: "memory-vibe", label: "比起日期，更记得当时的气氛" },
        { id: "memory-now", label: "比起过去，现在的对话更重要" },
      ],
      question: "留下很久的场景通常怎么被记住？",
    },
    {
      id: "balance",
      options: [
        { id: "balance-similar", label: "说话方式和速度越来越像" },
        { id: "balance-complementary", label: "因为不同，反而能补上彼此的空白" },
        { id: "balance-volatile", label: "顺的时候和错位的时候温差比较大" },
      ],
      question: "你们的聊天平衡更像哪一种？",
    },
    {
      id: "decision",
      options: [
        { id: "decision-together", label: "重要选择会一起对齐标准再决定" },
        { id: "decision-alternate", label: "会根据情况自然轮流主导" },
        { id: "decision-one-sided", label: "一方决定得更多，另一方配合得更多" },
      ],
      question: "做重要选择时的平衡是？",
    },
    {
      id: "space",
      options: [
        { id: "space-close", label: "经常靠近会让关系更舒服" },
        { id: "space-respecting", label: "各自的时间被尊重时会更稳" },
        { id: "space-uneven", label: "想要的距离不同，偶尔需要协调" },
      ],
      question: "你们怎么保留各自的时间？",
    },
  ],
  results: {
    archive: {
      mission: "今天说一个彼此还记得的最初场景，再用一句话说说现在变了什么。",
      nickname: "场景收藏型",
      reasons: [
        "长久留下的场景会成为关系的参照点。",
        "特定的话语和瞬间记得比较清楚。",
        "积累的聊天像两个人的时间线一样运作。",
      ],
      summary: "你们的聊天不会轻易放走过去的场景。以前的话和瞬间，会温柔地支撑现在的对话。",
    },
    harbor: {
      mission: "今天先不要急着下结论，先说一种让彼此舒服的聊天方式。",
      nickname: "安稳港口型",
      reasons: ["比起快速刺激，更重视稳定感。", "回复慢一点也不容易让关系断掉。", "差异更像各自的角色，而不是阻碍。"],
      summary: "你们的聊天有一个可以回来的地方。不一定戏剧化，但很会停留。",
    },
    orbit: {
      mission: "选一句常重复的问候或口头禅，聊聊它为什么变得熟悉。",
      nickname: "每日轨道型",
      reasons: ["自然重复形成了关系节奏。", "聊天比起大事件，更常在日常里活起来。", "越来越相似的话语会变成安心信号。"],
      summary: "你们的聊天靠每天的小重复靠近。魅力不在一次大事件，而在持续转动的轨道。",
    },
    rare: {
      mission: "今天发一个只有你们懂的信号，再加一句真实的心意。轻一点，但清楚一点。",
      nickname: "稀有对齐型",
      reasons: ["多个维度同时出现强聊天信号。", "日常节奏、暗号、修复方式朝同一方向排列。", "很难用一个常见模式解释。"],
      summary: "按结线模型来看，你们的聊天是相当少见的组合。它不像单一类型，更像两个人自己的语法。",
    },
    reconnect: {
      mission: "想起最近一次错位后重新接上的瞬间，把当时有效的一句话再用一次。",
      nickname: "重新连接型",
      reasons: ["有把中断的流动重新接上的力量。", "不会一直放着误会，而会确认或回来。", "不同速度也能变成恢复的材料。"],
      summary: "你们的聊天不一定总是顺滑，但很会重新接上。关键不是错位，而是再次开口的方式。",
    },
    signal: {
      mission: "选一个只有你们懂的表达，今天把它的意思说得更温柔一点。",
      nickname: "暗号信号型",
      reasons: [
        "直接说出口以外，还有很多能互相懂的信号。",
        "语气、表情符号和玩笑会承载感情。",
        "看似轻松的聊天里常有更深的意思。",
      ],
      summary: "从外面看也许普通，但你们之间有很多清晰的信号。稀有感就来自这些只有彼此懂的解释。",
    },
    spark: {
      mission: "发一句突然想到的话，最后留一点让对方轻松回复的空间。",
      nickname: "即兴火花型",
      reasons: ["想到的瞬间就能让聊天活起来。", "比起大计划，小火花更能推动关系。", "当下的情绪和反应更接近对话中心。"],
      summary: "你们的聊天常靠瞬间的火花活起来。轻轻开始的话题，可能会延长成一个很久的场景。",
    },
  },
  ui: {
    answeredCount: "{count}/{total} 已回答",
    backButton: "上一步",
    copyFallbackButton: "复制链接",
    copiedFeedback: "分享链接已复制。",
    emptyResultDescription: "分享链接已失效或格式不正确。重新回答即可生成新结果。",
    emptyResultTitle: "要重新计算吗？",
    gradeTitle: "聊天稀有度等级",
    heroCta: "查看我们的聊天等级",
    heroDescription: "不用上传文件，只用 16 个选择就能看到你们的聊天会落在哪个等级。",
    heroEyebrow: "不用文件也能看的聊天稀有度",
    heroSecondaryCta: "如何计算？",
    heroTitle: "我们的聊天是几级？",
    indexLabel: "稀有度指数",
    introNote: "大约 1 分钟就能生成结果卡。",
    missionTitle: "今天的聊天任务",
    modelStepGradeBody: "不会假装成真实用户排名，只按结线模型描述稀有组合。",
    modelStepGradeTitle: "模型基准等级",
    modelStepInputBody: "只用关系时长、聊天频率、支持方式、修复节奏等可以马上选择的问题。",
    modelStepInputTitle: "简单输入",
    modelStepShareBody: "把等级、昵称和一句总结做成适合发给朋友的结果卡。",
    modelStepShareTitle: "结果卡",
    modelNotice: "这是根据回答组合生成的结线模型排行。",
    nextButton: "下一题",
    questionEyebrow: "简单输入",
    reasonsTitle: "为什么是这个等级",
    resultButton: "查看结果",
    resultEyebrow: "聊天稀有度结果",
    restartButton: "重新开始",
    resultCardBody: "等级、昵称和一句总结已经整理成卡片。可以截图，也可以直接发链接。",
    resultCardTitle: "可以发出去的结果卡",
    shareButton: "分享结果",
    shareFallbackBody: "{grade} · {nickname} · 稀有度指数 {index}",
    shareLead: "结线模型基准",
    shareTitle: "我们的聊天稀有度结果",
  },
} as const satisfies GyeolContent;
