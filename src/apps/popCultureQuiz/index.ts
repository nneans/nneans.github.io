import { appShell, element, menuBar } from "../shared/dom";

const questions = [
  { prompt: "Which handheld pet became a schoolyard obsession in 1997?", options: ["Tamagotchi", "Walkman", "PalmPilot"], answer: 0 },
  { prompt: "What sound announced that a dial-up modem was connecting?", options: ["A quiet chime", "A sequence of beeps and static", "A voice saying online"], answer: 1 },
  { prompt: "Which storage icon still represents Save?", options: ["Cassette tape", "Floppy disk", "CD player"], answer: 1 },
  { prompt: "Which key combination opened the Windows security screen?", options: ["Ctrl + Alt + Delete", "Shift + Space", "Alt + Tab"], answer: 0 },
];

export function renderPopCultureQuiz(): HTMLElement {
  const app = appShell("quiz-app");
  const panel = element("section", "quiz-panel sunken");
  const progress = element("p", "quiz-progress");
  const prompt = element("h1");
  const options = element("div", "quiz-options");
  const result = element("p", "quiz-answer");
  let index = 0;
  let score = 0;

  const show = (): void => {
    const question = questions[index];
    progress.textContent = `Question ${index + 1} of ${questions.length} · Score ${score}`;
    prompt.textContent = question.prompt;
    result.textContent = "";
    options.replaceChildren();
    question.options.forEach((label, answerIndex) => {
      const button = element("button", "classic-button raised", label);
      button.type = "button";
      button.addEventListener("click", () => {
        const correct = answerIndex === question.answer;
        if (correct) score += 1;
        result.textContent = correct ? "Correct!" : `Not quite — ${question.options[question.answer]}.`;
        options.querySelectorAll("button").forEach((candidate) => { candidate.setAttribute("disabled", "true"); });
        const next = element("button", "classic-button raised", index === questions.length - 1 ? "Play again" : "Next question →");
        next.type = "button";
        next.addEventListener("click", () => {
          if (index === questions.length - 1) { index = 0; score = 0; }
          else index += 1;
          show();
        });
        options.append(next);
      });
      options.append(button);
    });
  };
  show();
  panel.append(progress, prompt, options, result);
  app.append(menuBar(["Quiz", "High Scores", "Help"]), panel);
  return app;
}
