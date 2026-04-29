import type { GyeolContent } from "../_lib/types";

export const rarityContent = {
  grades: {
    1: {
      description: "A very uncommon mix in the Gyeoltare model, with strong signals across several axes.",
      label: "Grade 1",
      mountainLabel: "Very rare mix",
    },
    2: {
      description: "A less common mix with a clear rhythm that only the two of you would recognize.",
      label: "Grade 2",
      mountainLabel: "Rare mix",
    },
    3: {
      description: "A distinctive mix where familiar couple talk carries a few special patterns.",
      label: "Grade 3",
      mountainLabel: "Distinctive mix",
    },
    4: {
      description: "A balanced middle mix, with steadiness and small variations showing together.",
      label: "Grade 4",
      mountainLabel: "Balanced mix",
    },
    5: {
      description: "A comfortable mix seen in many couples, where familiarity does most of the work.",
      label: "Grade 5",
      mountainLabel: "Comfort mix",
    },
    6: {
      description: "A predictable and steady mix, where stability appears before rarity.",
      label: "Grade 6",
      mountainLabel: "Stable mix",
    },
    7: {
      description: "The most everyday mix. Not rare, but still full of habits that can last.",
      label: "Grade 7",
      mountainLabel: "Everyday mix",
    },
  },
  metadata: {
    description: "A conversation rarity ranking that turns 16 quick choices into a grade and result card.",
    title: "Conversation Gyeol Ranking - Gyeoltare",
  },
  questions: [
    {
      id: "duration",
      options: [
        { id: "duration-new", label: "We are still learning each other's wording" },
        { id: "duration-seasonal", label: "A few seasons have given us a rhythm" },
        { id: "duration-long", label: "We have many old scenes and private codes" },
      ],
      question: "How much conversation history do you have?",
    },
    {
      id: "frequency",
      options: [
        { id: "frequency-daily", label: "It continues almost every day" },
        { id: "frequency-steady", label: "It has a steady, unforced pace" },
        { id: "frequency-event", label: "It lights up around moments and plans" },
      ],
      question: "What is your conversation frequency like?",
    },
    {
      id: "replyRhythm",
      options: [
        { id: "reply-fast", label: "One thought quickly turns into a thread" },
        { id: "reply-slow", label: "Slow replies do not really break the flow" },
        { id: "reply-asymmetric", label: "One starts it, the other deepens it" },
      ],
      question: "What shape does your reply rhythm have?",
    },
    {
      id: "planning",
      options: [
        { id: "plans-flexible", label: "We mix spontaneity and planning depending on the situation" },
        { id: "plans-planned", label: "We feel better when timing and energy are planned ahead" },
        { id: "plans-drifting", label: "We often go with the flow and sometimes miss each other" },
      ],
      question: "How do you plan dates or days off?",
    },
    {
      id: "changeResponse",
      options: [
        { id: "change-fast", label: "We change direction quickly when plans shift" },
        { id: "change-cautious", label: "We look around first, then adjust slowly" },
        { id: "change-role-split", label: "One moves first while the other organizes the landing" },
      ],
      question: "What happens when plans suddenly change?",
    },
    {
      id: "expression",
      options: [
        { id: "expression-direct", label: "We say likes and dislikes fairly clearly" },
        { id: "expression-subtle", label: "Mood and actions often speak first" },
        { id: "expression-mixed", label: "We mix direct words with private signals" },
      ],
      question: "How do you usually show affection?",
    },
    {
      id: "reassurance",
      options: [
        { id: "reassurance-clear", label: "Clear words make us feel most secure" },
        { id: "reassurance-subtle", label: "Small actions and mood are usually enough" },
        { id: "reassurance-awkward", label: "The feeling is there, but timing can get awkward" },
      ],
      question: "What kind of reassurance works best?",
    },
    {
      id: "support",
      options: [
        { id: "support-listen", label: "Listening all the way through helps most" },
        { id: "support-practical", label: "Practical help feels most reassuring" },
        { id: "support-light", label: "A lighter shift or joke helps us breathe" },
      ],
      question: "What response helps most on a hard day?",
    },
    {
      id: "repair",
      options: [
        { id: "repair-fast", label: "We need to check misunderstandings quickly" },
        { id: "repair-cooldown", label: "We cool down, then return calmly" },
        { id: "repair-comeback", label: "Even after a pause, we somehow reconnect" },
      ],
      question: "How do you recover from small misunderstandings?",
    },
    {
      id: "apology",
      options: [
        { id: "apology-fast", label: "A quick sorry opens the door again" },
        { id: "apology-action", label: "Changed behavior matters more than words" },
        { id: "apology-miss", label: "We sometimes miss the timing and get awkward later" },
      ],
      question: "How do apologies usually work?",
    },
    {
      id: "stress",
      options: [
        { id: "stress-share", label: "We bring up hard things with each other fairly well" },
        { id: "stress-quiet", label: "We sort things out alone, then share what is needed" },
        { id: "stress-bounce", label: "We change the mood before things get too heavy" },
      ],
      question: "What happens when stress gets bigger?",
    },
    {
      id: "privateSignals",
      options: [
        { id: "signals-many", label: "We have many nicknames, memes, and emoji signals" },
        { id: "signals-some", label: "We have a few recurring jokes and tones" },
        { id: "signals-few", label: "Everyday talk feels easier than private codes" },
      ],
      question: "How many private signals do you share?",
    },
    {
      id: "memory",
      options: [
        { id: "memory-exact", label: "We remember first scenes or certain chats clearly" },
        { id: "memory-vibe", label: "The mood lasts longer than exact dates" },
        { id: "memory-now", label: "The current conversation matters most" },
      ],
      question: "How do memorable scenes stay with you?",
    },
    {
      id: "balance",
      options: [
        { id: "balance-similar", label: "Our wording and pace are starting to look alike" },
        { id: "balance-complementary", label: "Our differences fill in each other's gaps" },
        { id: "balance-volatile", label: "The temperature changes a lot between good and off days" },
      ],
      question: "What is your conversation balance like?",
    },
    {
      id: "decision",
      options: [
        { id: "decision-together", label: "We align on important choices together" },
        { id: "decision-alternate", label: "We naturally take turns leading by situation" },
        { id: "decision-one-sided", label: "One of us usually decides more, while the other follows" },
      ],
      question: "How do you handle important decisions?",
    },
    {
      id: "space",
      options: [
        { id: "space-close", label: "We feel better when we stay close often" },
        { id: "space-respecting", label: "Respecting separate time makes us stronger" },
        { id: "space-uneven", label: "We sometimes want different amounts of space" },
      ],
      question: "How do you give each other personal space?",
    },
  ],
  results: {
    archive: {
      mission: "Bring up one first scene you still remember, then say one thing that has changed since then.",
      nickname: "Scene Keeper",
      reasons: [
        "Old scenes act like anchors.",
        "Specific wording and moments stay clear.",
        "Accumulated chats read like your own timeline.",
      ],
      summary:
        "Your conversation does not let old moments disappear easily. Past words and scenes gently shape how you talk now.",
    },
    harbor: {
      mission: "Do not rush to a conclusion today. Start with one conversation style that feels comfortable.",
      nickname: "Steady Harbor",
      reasons: [
        "Steadiness matters more than fast sparks.",
        "Slow replies do not easily break the bond.",
        "Differences are accepted like roles.",
      ],
      summary: "Your conversation has a place to return to. It may not always be dramatic, but it knows how to stay.",
    },
    orbit: {
      mission: "Pick one repeated greeting or phrase and talk about why it became familiar.",
      nickname: "Daily Orbit",
      reasons: [
        "Repetition creates rhythm.",
        "Everyday talk stays alive more than big events.",
        "Similar wording becomes a comfort signal.",
      ],
      summary:
        "Your conversation grows closer through small daily repeats. Its charm is the orbit, not one huge moment.",
    },
    rare: {
      mission: "Send one private signal and one honest feeling today. Keep it light, but clear.",
      nickname: "Rare Alignment",
      reasons: [
        "Strong signals appear across several axes.",
        "Everyday rhythm, private codes, and repair line up.",
        "One common pattern cannot explain it well.",
      ],
      summary:
        "In the Gyeoltare model, your conversation is a fairly rare mix. It feels less like a type and more like a language of your own.",
    },
    reconnect: {
      mission: "Think of a recent moment that went off track and write again the sentence that helped you reconnect.",
      nickname: "Reconnect Rhythm",
      reasons: [
        "You can bring a stopped flow back.",
        "Misunderstandings are checked or returned to.",
        "Different speeds become repair material.",
      ],
      summary: "Your conversation is not always smooth, but it knows how to reconnect. The key is how you restart.",
    },
    signal: {
      mission: "Choose one expression only you two understand, and explain it a little more warmly today.",
      nickname: "Private Signal",
      reasons: [
        "You share signals beyond direct words.",
        "Tone, emoji, and jokes carry feelings.",
        "Light-looking talk often has deep meaning.",
      ],
      summary: "Your conversation may look ordinary outside, but it has signals that are clear to the two of you.",
    },
    spark: {
      mission: "Send one sudden thought, then leave room for an easy reply.",
      nickname: "Instant Spark",
      reasons: [
        "Talk comes alive from quick moments.",
        "Small sparks move the relationship more than big plans.",
        "Current feeling is central to the flow.",
      ],
      summary: "Your conversation comes alive through sudden sparks. A light start can turn into a longer scene.",
    },
  },
  ui: {
    answeredCount: "{count}/{total} answered",
    backButton: "Back",
    copyFallbackButton: "Copy link",
    copiedFeedback: "Share link copied.",
    emptyResultDescription: "The shared link is expired or invalid. Answer again to make a fresh result.",
    emptyResultTitle: "Calculate again?",
    gradeTitle: "Conversation rarity grade",
    heroCta: "Check our grade",
    heroDescription:
      "Answer 16 quick choices and see what grade your conversation lands in, based on the Gyeoltare model.",
    heroEyebrow: "Conversation rarity without files",
    heroSecondaryCta: "How is it calculated?",
    heroTitle: "What grade is our conversation?",
    indexLabel: "Gyeol index",
    introNote: "Get a result card in about a minute.",
    missionTitle: "Today's conversation mission",
    modelStepGradeBody:
      "It never pretends to be a real user ranking. Results are described only as rare mixes in the Gyeoltare model.",
    modelStepGradeTitle: "Model-based grade",
    modelStepInputBody: "It asks quick picks like duration, frequency, reply rhythm, support, and comeback style.",
    modelStepInputTitle: "Quick input",
    modelStepShareBody: "It wraps your grade, nickname, and one-line summary into a card worth sending.",
    modelStepShareTitle: "Result card",
    modelNotice: "This ranking is generated from your answer mix using the Gyeoltare model.",
    nextButton: "Next",
    questionEyebrow: "Quick input",
    reasonsTitle: "Why this grade",
    resultButton: "View result",
    resultEyebrow: "Conversation rarity result",
    restartButton: "Restart",
    resultCardBody:
      "Your grade, nickname, and one-line summary are wrapped as a card. Send the link or share the screenshot.",
    resultCardTitle: "Result card to send",
    shareButton: "Share result",
    shareFallbackBody: "{grade} · {nickname} · rarity index {index}",
    shareLead: "Gyeoltare model",
    shareTitle: "Our conversation rarity result",
  },
} as const satisfies GyeolContent;
