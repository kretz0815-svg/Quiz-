# E-Commerce-Paragraphen-Quiz - Technisches Konzept

## 1. TECHNISCHE ARCHITEKTUR

### 1.1 Datenmodell

#### User-Profil
```typescript
interface UserProfile {
  id: string;
  username: string;
  email: string;
  registrationDate: Date;
  totalScore: number;
  highscores: {
    easy: number;
    medium: number;
    hard: number;
  };
  statistics: {
    totalGamesPlayed: number;
    totalQuestionsAnswered: number;
    correctAnswers: number;
    wrongAnswers: number;
    averageResponseTime: number;
  };
  preferences: {
    darkMode: boolean;
    hapticFeedback: boolean;
  };
}
```

#### Game-Session
```typescript
interface GameSession {
  id: string;
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  strikes: number; // 0-3
  score: number;
  answeredQuestions: AnsweredQuestion[];
  status: 'active' | 'completed' | 'game_over';
}

interface AnsweredQuestion {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  responseTime: number; // in milliseconds
  aiExplanation?: string;
}
```

#### Question-Pool
```typescript
interface Question {
  id: string;
  paragraph: string; // z.B. "§ 312j Abs. 3 BGB"
  questionText: string;
  difficulty: 'easy' | 'medium' | 'hard';
  correctAnswer: string;
  wrongOptions?: string[]; // nur für easy/medium
  explanation: string;
  category: 'BGB' | 'EGBGB' | 'UWG' | 'PAngV' | 'DSGVO' | 'Sonstige';
  tags: string[];
}
```

### 1.2 Funktionale Endpunkte / Services

#### Authentication Service
- `registerUser(username, email, password)` → UserProfile
- `loginUser(email, password)` → AuthToken
- `logoutUser(userId)` → void
- `updateUserPreferences(userId, preferences)` → UserProfile

#### Game Service
- `startGame(userId, difficulty)` → GameSession
- `getNextQuestion(sessionId)` → Question
- `submitAnswer(sessionId, questionId, answer)` → AnswerResult
- `endGame(sessionId)` → GameSummary
- `getHighscores(difficulty?)` → Highscore[]

#### Question Service
- `getQuestionsByDifficulty(difficulty)` → Question[]
- `getRandomQuestion(difficulty, excludeIds)` → Question
- `validateAnswer(questionId, userAnswer)` → boolean

#### AI Feedback Service
- `generateExplanation(question, userAnswer, correctAnswer)` → string
- `analyzeUnclearAnswer(questionId, userAnswer)` → FeedbackResponse

#### UI Service
- `toggleDarkMode(userId)` → void
- `triggerHapticFeedback(type: 'error' | 'success' | 'warning')` → void
- `startTimer(duration, onTick, onComplete)` → TimerHandle
- `stopTimer(timerHandle)` → void

### 1.3 Technologie-Stack Empfehlung

**Frontend:**
- HTML5, CSS3 (mit CSS Variables für Dark Mode)
- Vanilla JavaScript oder React/Vue.js
- Vibration API für haptisches Feedback
- LocalStorage/IndexedDB für Offline-Fähigkeit

**Backend (optional):**
- Node.js + Express oder Firebase
- PostgreSQL/MongoDB für Datenpersistenz
- OpenAI API oder Google Gemini für KI-Feedback

**Alternative (Full Client-Side):**
- IndexedDB für lokale Datenspeicherung
- Gemini Nano (on-device AI) für Feedback-Generierung

---

## 2. BEISPIELFRAGEN

### 2.1 LEICHT (Multiple Choice, kein Zeitlimit)

#### Frage 1
**Frage:** Welcher Paragraph regelt die "Button-Lösung" im Online-Shop?  
**Paragraph:** § 312j Abs. 3 BGB  
**Richtige Antwort:** § 312j Abs. 3 BGB  
**Falsche Optionen:**
- § 312i Abs. 1 BGB
- § 312d Abs. 1 BGB
- § 433 Abs. 2 BGB

**Erklärung:**  
*Richtig! § 312j Abs. 3 BGB schreibt die "Button-Lösung" vor. Das bedeutet: Der Bestell-Button muss eindeutig beschriftet sein, z.B. mit "zahlungspflichtig bestellen". So wird sichergestellt, dass Kunden wissen, dass sie mit dem Klick eine kostenpflichtige Bestellung auslösen. Das schützt vor versehentlichen Käufen!*

---

#### Frage 2
**Frage:** Wie lange muss ein Lockvogelangebot laut UWG mindestens verfügbar sein?  
**Paragraph:** § 3 Abs. 3 UWG i.V.m. Anhang Nr. 5  
**Richtige Antwort:** 2 Tage  
**Falsche Optionen:**
- 1 Tag
- 3 Tage
- 1 Woche

**Erklärung:**  
*Genau! Nach § 3 Abs. 3 UWG (Schwarze Liste) muss beworbene Ware in der Regel mindestens 2 Tage verfügbar sein. Sonst gilt es als "Lockvogelangebot" – eine unlautere Geschäftspraxis. Der Gesetzgeber will verhindern, dass Kunden mit Angeboten angelockt werden, die gar nicht erhältlich sind.*

---

#### Frage 3
**Frage:** Welcher Artikel der DSGVO regelt den Grundsatz der Datenminimierung?  
**Paragraph:** Art. 5 DSGVO  
**Richtige Antwort:** Art. 5 DSGVO  
**Falsche Optionen:**
- Art. 6 DSGVO
- Art. 7 DSGVO
- Art. 13 DSGVO

**Erklärung:**  
*Perfekt! Art. 5 DSGVO legt die Grundsätze für die Datenverarbeitung fest, darunter die "Datenminimierung". Das bedeutet: Du darfst nur so viele personenbezogene Daten erheben, wie wirklich nötig sind. Beispiel: Für eine Gastbestellung brauchst du keine Geburtsdaten!*

---

#### Frage 4
**Frage:** Ab wann gilt die Pflicht zur Barrierefreiheit im E-Commerce nach dem BFSG?  
**Paragraph:** BFSG  
**Richtige Antwort:** 28.06.2025  
**Falsche Optionen:**
- 01.01.2024
- 01.01.2025
- 31.12.2025

**Erklärung:**  
*Richtig! Ab dem 28.06.2025 müssen Online-Shops barrierefrei sein (BFSG). Das heißt: Menschen mit Behinderungen müssen deine Website problemlos nutzen können. Ausnahme: Kleinstunternehmen (unter 10 Mitarbeiter, max. 2 Mio. € Umsatz) sind befreit.*

---

#### Frage 5
**Frage:** Welcher Paragraph regelt das Widerrufsrecht bei Fernabsatzverträgen?  
**Paragraph:** § 312g BGB  
**Richtige Antwort:** § 312g BGB  
**Falsche Optionen:**
- § 355 BGB
- § 312c BGB
- § 651h BGB

**Erklärung:**  
*Sehr gut! § 312g BGB regelt das Widerrufsrecht bei Fernabsatzverträgen (z.B. Online-Käufe). Kunden haben in der Regel 14 Tage Zeit, um ohne Angabe von Gründen zu widerrufen. § 355 BGB regelt nur die Ausübung des Widerrufs, nicht das Recht selbst.*

---

### 2.2 MITTEL (Multiple Choice, 5-Sekunden-Timer)

#### Frage 1
**Frage:** Welche Informationspflicht gilt laut Art. 246a EGBGB NICHT im Fernabsatz?  
**Paragraph:** Art. 246a § 1 Abs. 1 EGBGB  
**Richtige Antwort:** Angabe der Schuhgröße des Verkäufers  
**Falsche Optionen:**
- Wesentliche Eigenschaften der Ware
- Zahlungs- und Lieferbedingungen
- Informationen zum Widerrufsrecht

**Erklärung:**  
*Korrekt! Art. 246a EGBGB listet die Informationspflichten auf – aber die Schuhgröße des Verkäufers gehört natürlich nicht dazu! 😊 Wichtig sind: Produkteigenschaften, Preise, Zahlungs-/Lieferbedingungen und das Widerrufsrecht. Diese Infos müssen klar und verständlich sein.*

---

#### Frage 2
**Frage:** Warum ist Sofortüberweisung als alleinige unentgeltliche Zahlungsart unzulässig?  
**Paragraph:** § 312a Abs. 4 BGB + BGH-Urteil KZR 39/16  
**Richtige Antwort:** Datenschutzbedenken  
**Falsche Optionen:**
- Zu hohe Gebühren
- Technische Unzuverlässigkeit
- Fehlende EU-Zulassung

**Erklärung:**  
*Genau! Der BGH hat 2017 entschieden: Sofortüberweisung allein reicht nicht, weil dabei sensible Kontodaten an Dritte weitergegeben werden (Datenschutzproblem). Du musst mindestens eine weitere kostenlose Zahlungsart anbieten, z.B. Lastschrift oder Rechnung.*

---

#### Frage 3
**Frage:** Welche Ausnahme vom Widerrufsrecht gilt bei Reisebuchungen?  
**Paragraph:** § 312g Abs. 9 BGB  
**Richtige Antwort:** Beherbergung/Beförderung zu spezifischen Terminen  
**Falsche Optionen:**
- Alle Reisen unter 100 €
- Nur Flugreisen
- Reisen ins EU-Ausland

**Erklärung:**  
*Richtig! Bei Reisen mit festem Termin (z.B. Hotelübernachtung am 15.08.) gibt es kein Widerrufsrecht nach § 312g Abs. 9 BGB. Stattdessen greift § 651h BGB: Du kannst vor Reisebeginn zurücktreten, musst aber eine Entschädigung zahlen. Das schützt Anbieter vor kurzfristigen Stornierungen.*

---

#### Frage 4
**Frage:** Was muss laut § 11 PAngV bei Preiswerbung mit Ermäßigungen angegeben werden?  
**Paragraph:** § 11 PAngV  
**Richtige Antwort:** Niedrigster Preis der letzten 30 Tage  
**Falsche Optionen:**
- Durchschnittspreis der letzten 12 Monate
- Ursprünglicher Herstellerpreis
- Preis des günstigsten Konkurrenten

**Erklärung:**  
*Perfekt! Seit 2022 gilt: Wenn du mit "Rabatt" wirbst, musst du den niedrigsten Preis der letzten 30 Tage angeben. So sollen Fake-Rabatte verhindert werden (z.B. Preis kurz vor dem Sale künstlich erhöhen). Transparenz für Verbraucher!*

---

#### Frage 5
**Frage:** Welche Pflicht ergibt sich aus § 312i Abs. 1 Nr. 3 BGB?  
**Paragraph:** § 312i Abs. 1 Nr. 3 BGB  
**Richtige Antwort:** Unverzügliche elektronische Bestellbestätigung  
**Falsche Optionen:**
- Versand innerhalb von 24 Stunden
- Telefonische Rückbestätigung
- Zusendung einer schriftlichen Rechnung

**Erklärung:**  
*Sehr gut! Nach § 312i Abs. 1 Nr. 3 BGB musst du den Zugang einer Bestellung unverzüglich elektronisch bestätigen (z.B. per E-Mail). Das gibt dem Kunden Sicherheit, dass seine Bestellung angekommen ist. "Unverzüglich" heißt: ohne schuldhaftes Zögern, also idealerweise sofort automatisiert.*

---

### 2.3 SCHWER (Open-Text-Input, manuelle Eingabe)

#### Frage 1
**Frage:** Nenne den Paragraphen, der regelt, dass ein Vertrag auch ohne ausdrückliche Annahmeerklärung zustande kommen kann, wenn dies der Verkehrssitte entspricht.  
**Paragraph:** § 151 BGB  
**Richtige Antwort:** § 151 BGB  
**Akzeptierte Varianten:** 151 BGB, §151 BGB, Paragraph 151 BGB

**Erklärung:**  
*Exzellent! § 151 BGB besagt: Wenn es üblich ist (Verkehrssitte), kann ein Vertrag auch ohne ausdrückliche "Ja, ich nehme an"-Erklärung zustande kommen. Beispiel: Du bestellst online, der Shop verschickt die Ware einfach – das gilt als konkludente Annahme. Wichtig im E-Commerce!*

---

#### Frage 2
**Frage:** Welcher Paragraph des BGB definiert die Pflichten des Käufers (Zahlung und Abnahme)?  
**Paragraph:** § 433 Abs. 2 BGB  
**Richtige Antwort:** § 433 Abs. 2 BGB  
**Akzeptierte Varianten:** 433 Abs. 2 BGB, §433 Abs. 2 BGB, 433 II BGB, § 433 II BGB

**Erklärung:**  
*Perfekt! § 433 Abs. 2 BGB ist das Gegenstück zu Abs. 1 (Verkäuferpflichten). Der Käufer muss den Kaufpreis zahlen UND die Ware abnehmen. "Abnehmen" bedeutet: Die Ware entgegennehmen und den Besitz übernehmen. Beides sind Hauptpflichten im Kaufvertrag!*

---

#### Frage 3
**Frage:** Welcher Artikel der DSGVO ermöglicht die Datenverarbeitung aufgrund eines "berechtigten Interesses" (z.B. bei Bonitätsprüfung)?  
**Paragraph:** Art. 6 Abs. 1 lit. f DSGVO  
**Richtige Antwort:** Art. 6 Abs. 1 lit. f DSGVO  
**Akzeptierte Varianten:** Art. 6 Abs. 1 lit. f, Artikel 6 Absatz 1 Buchstabe f DSGVO, Art 6 I f DSGVO

**Erklärung:**  
*Hervorragend! Art. 6 Abs. 1 lit. f DSGVO erlaubt Datenverarbeitung, wenn ein "berechtigtes Interesse" vorliegt – z.B. Bonitätsprüfung zur Vermeidung von Zahlungsausfällen. ABER: Das Interesse muss gegen die Rechte des Betroffenen abgewogen werden. Nicht alles ist erlaubt!*

---

#### Frage 4
**Frage:** Nenne den Paragraphen des UWG, der irreführende geschäftliche Handlungen verbietet.  
**Paragraph:** § 5 UWG  
**Richtige Antwort:** § 5 UWG  
**Akzeptierte Varianten:** 5 UWG, §5 UWG, Paragraph 5 UWG

**Erklärung:**  
*Richtig! § 5 UWG verbietet irreführende Werbung und Geschäftspraktiken. Beispiele: Falsche Produktangaben, erfundene Testergebnisse, irreführende Preise. Ergänzung: § 5a UWG regelt die Irreführung durch Unterlassen (wenn du wichtige Infos verschweigst).*

---

#### Frage 5
**Frage:** Welcher Paragraph regelt die Eigentumsübertragung durch Einigung und Übergabe?  
**Paragraph:** § 929 BGB  
**Richtige Antwort:** § 929 BGB  
**Akzeptierte Varianten:** 929 BGB, §929 BGB, Paragraph 929 BGB

**Erklärung:**  
*Exzellent! § 929 BGB ist DER Paragraph für Eigentumsübertragung bei beweglichen Sachen. Es braucht zwei Dinge: 1) Einigung (beide wollen, dass Eigentum übergeht) und 2) Übergabe (physische Besitzübertragung). Im E-Commerce: Einigung beim Kaufvertrag, Übergabe bei Lieferung!*

---

## 3. LOGIK-ABLAUFPLAN

### 3.1 Game-Flow-Diagramm

```
START
  ↓
[Benutzer wählt Schwierigkeitsgrad]
  ↓
[Initialisiere GameSession]
  - strikes = 0
  - score = 0
  - startTime = now()
  ↓
┌─────────────────────────────────┐
│  FRAGE-SCHLEIFE                 │
├─────────────────────────────────┤
│ 1. Hole nächste Frage           │
│    (nicht bereits beantwortet)  │
│ 2. Zeige Frage an               │
│ 3. Starte Timer (nur MITTEL)    │
│    ├─ Countdown von 5s          │
│    └─ Bei 0s → Auto-Submit      │
│ 4. Warte auf Antwort            │
│ 5. Validiere Antwort            │
│    ├─ RICHTIG?                  │
│    │   ├─ score += Punkte       │
│    │   ├─ Haptic: Success       │
│    │   └─ Zeige Erklärung       │
│    └─ FALSCH?                   │
│        ├─ strikes += 1           │
│        ├─ Haptic: Error (lang)  │
│        ├─ Generiere KI-Feedback │
│        └─ Zeige Erklärung       │
│ 6. Prüfe Game-Over-Bedingung    │
│    └─ strikes >= 3?             │
│        ├─ JA → GAME OVER        │
│        └─ NEIN → Weiter         │
└─────────────────────────────────┘
  ↓
[GAME OVER oder Freiwilliges Ende]
  ↓
[Berechne Endpunktzahl]
  ↓
[Update Highscore (falls besser)]
  ↓
[Zeige Zusammenfassung]
  - Erreichte Punkte
  - Anzahl richtiger Antworten
  - Durchschnittliche Antwortzeit
  - Neue Bestleistung?
  ↓
[Optionen: Nochmal / Hauptmenü]
```

### 3.2 Timer-Mechanik (MITTEL-Modus)

```javascript
class QuestionTimer {
  constructor(duration, onTick, onTimeout) {
    this.duration = duration; // 5000ms
    this.remaining = duration;
    this.onTick = onTick; // Callback für UI-Update
    this.onTimeout = onTimeout; // Callback bei Ablauf
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => {
      this.remaining -= 100; // Update alle 100ms
      
      // UI-Update (z.B. Progressbar)
      this.onTick(this.remaining);
      
      // Zeitablauf?
      if (this.remaining <= 0) {
        this.stop();
        this.onTimeout(); // Auto-Submit der Antwort
      }
    }, 100);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
    this.remaining = this.duration;
  }
}

// Verwendung:
const timer = new QuestionTimer(
  5000,
  (remaining) => {
    // Update UI (z.B. Progressbar)
    const percentage = (remaining / 5000) * 100;
    progressBar.style.width = percentage + '%';
    
    // Warnung bei < 2 Sekunden
    if (remaining < 2000) {
      progressBar.classList.add('warning');
    }
  },
  () => {
    // Zeit abgelaufen → Auto-Submit
    submitAnswer(null); // null = keine Antwort
  }
);

timer.start();
```

### 3.3 Haptisches Feedback (Vibration)

```javascript
class HapticFeedback {
  constructor(enabled = true) {
    this.enabled = enabled;
    this.isSupported = 'vibrate' in navigator;
  }

  trigger(type) {
    if (!this.enabled || !this.isSupported) return;

    switch(type) {
      case 'success':
        // Kurze Bestätigung
        navigator.vibrate(50);
        break;
      
      case 'error':
        // Lange Vibration bei Fehler (3 Strikes-Regel)
        navigator.vibrate([200, 100, 200, 100, 200]);
        break;
      
      case 'warning':
        // Mittlere Vibration (z.B. Zeit läuft ab)
        navigator.vibrate(100);
        break;
      
      case 'game_over':
        // Dramatische Sequenz
        navigator.vibrate([300, 200, 300, 200, 500]);
        break;
      
      default:
        navigator.vibrate(50);
    }
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }
}

// Verwendung:
const haptic = new HapticFeedback(userPreferences.hapticFeedback);

// Bei falscher Antwort:
if (!isCorrect) {
  strikes++;
  haptic.trigger('error'); // Lange Vibration
  
  if (strikes >= 3) {
    haptic.trigger('game_over');
    endGame('game_over');
  }
}

// Bei richtiger Antwort:
if (isCorrect) {
  haptic.trigger('success'); // Kurze Bestätigung
}
```

### 3.4 Dark Mode Toggle

```javascript
class DarkModeManager {
  constructor() {
    this.isDark = this.loadPreference();
    this.apply();
  }

  loadPreference() {
    // Prüfe LocalStorage
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    
    // Fallback: System-Präferenz
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggle() {
    this.isDark = !this.isDark;
    this.apply();
    this.save();
  }

  apply() {
    document.documentElement.setAttribute(
      'data-theme',
      this.isDark ? 'dark' : 'light'
    );
  }

  save() {
    localStorage.setItem('darkMode', this.isDark.toString());
    
    // Optional: Sync mit Backend
    if (currentUser) {
      updateUserPreferences(currentUser.id, {
        darkMode: this.isDark
      });
    }
  }
}

// CSS-Variablen für Dark Mode:
/*
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --accent: #007bff;
  --error: #dc3545;
  --success: #28a745;
}

:root[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --accent: #4da3ff;
  --error: #ff6b7a;
  --success: #5cd67c;
}
*/

// Verwendung:
const darkMode = new DarkModeManager();

toggleButton.addEventListener('click', () => {
  darkMode.toggle();
});
```

### 3.5 KI-Feedback-Generierung

```javascript
class AIFeedbackService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openai.com/v4/chat/completions';
  }

  async generateExplanation(question, userAnswer, correctAnswer, isCorrect) {
    const prompt = this.buildPrompt(question, userAnswer, correctAnswer, isCorrect);
    
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Du bist ein motivierender E-Commerce-Rechts-Tutor. Erkläre Paragraphen fachlich korrekt, aber verständlich und ermutigend für Auszubildende.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
      
    } catch (error) {
      console.error('KI-Feedback-Fehler:', error);
      // Fallback: Vordefinierte Erklärung
      return question.explanation;
    }
  }

  buildPrompt(question, userAnswer, correctAnswer, isCorrect) {
    if (isCorrect) {
      return `Der Nutzer hat die Frage "${question.questionText}" korrekt mit "${correctAnswer}" beantwortet. Gib eine kurze, motivierende Bestätigung (max. 2 Sätze) und erkläre, warum diese Antwort wichtig für E-Commerce ist.`;
    } else {
      return `Der Nutzer hat die Frage "${question.questionText}" falsch beantwortet. 
      
Korrekte Antwort: ${correctAnswer}
Antwort des Nutzers: ${userAnswer || 'Keine Antwort'}

Erkläre in 2-3 Sätzen:
1. Warum die richtige Antwort korrekt ist
2. Was der häufige Fehler/Missverständnis ist
3. Ein praxisnahes Beispiel aus dem E-Commerce

Ton: Ermutigend, nicht belehrend. Nutze Emojis sparsam.`;
    }
  }
}

// Verwendung:
const aiService = new AIFeedbackService(API_KEY);

async function handleAnswer(questionId, userAnswer) {
  const question = getQuestion(questionId);
  const isCorrect = validateAnswer(question, userAnswer);
  
  // Generiere KI-Feedback (parallel zur UI-Aktualisierung)
  const feedbackPromise = aiService.generateExplanation(
    question,
    userAnswer,
    question.correctAnswer,
    isCorrect
  );
  
  // Update UI sofort
  updateUI(isCorrect);
  
  // Zeige KI-Feedback, sobald verfügbar
  const feedback = await feedbackPromise;
  displayFeedback(feedback);
}
```

### 3.6 Punkteberechnung

```javascript
function calculateScore(difficulty, responseTime, isCorrect) {
  if (!isCorrect) return 0;
  
  const basePoints = {
    'easy': 10,
    'medium': 20,
    'hard': 50
  };
  
  let points = basePoints[difficulty];
  
  // Zeitbonus nur bei MITTEL
  if (difficulty === 'medium') {
    const timeBonus = Math.max(0, Math.floor((5000 - responseTime) / 100));
    points += timeBonus; // Bis zu +50 Punkte
  }
  
  // Streak-Bonus (3+ richtige Antworten hintereinander)
  if (currentStreak >= 3) {
    points *= 1.5;
  }
  
  return Math.floor(points);
}

// Beispiel:
// LEICHT: 10 Punkte (fix)
// MITTEL: 20-70 Punkte (20 Base + bis zu 50 Zeitbonus)
// SCHWER: 50 Punkte (fix, da kein Timer)
// Mit Streak: x1.5
```

---

## 4. ZUSÄTZLICHE FEATURES

### 4.1 Fragen-Pool-Management
- **Keine Wiederholungen:** Bereits beantwortete Fragen werden in der Session gespeichert und ausgeschlossen
- **Kategorien-Balance:** Algorithmus stellt sicher, dass Fragen aus verschiedenen Rechtsbereichen kommen
- **Schwierigkeits-Progression:** Optional kann nach X richtigen Antworten automatisch der Schwierigkeitsgrad erhöht werden

### 4.2 Statistiken & Analytics
- **Lernfortschritt:** Welche Paragraphen wurden am häufigsten falsch beantwortet?
- **Zeitanalyse:** Durchschnittliche Antwortzeit pro Schwierigkeitsgrad
- **Streak-Tracking:** Längste Serie korrekter Antworten
- **Kategorie-Stärken:** In welchen Rechtsbereichen ist der Nutzer am stärksten?

### 4.3 Gamification-Elemente
- **Achievements:** "Perfektes Spiel" (keine Fehler), "Speed Demon" (alle Fragen < 3s), "Rechts-Guru" (100 Fragen korrekt)
- **Leaderboard:** Wöchentliche/Monatliche Ranglisten
- **Lernstreak:** Tägliche Nutzung wird belohnt
- **Paragraph-Sammlung:** "Sammle alle 50 E-Commerce-Paragraphen"

---

## 5. IMPLEMENTIERUNGS-ROADMAP

### Phase 1: MVP (Minimum Viable Product)
- [ ] User-Registrierung & Login
- [ ] Fragen-Datenbank (mind. 15 Fragen pro Schwierigkeitsgrad)
- [ ] 3-Strikes-Mechanik
- [ ] Basis-Scoring
- [ ] Dark Mode Toggle
- [ ] Haptisches Feedback

### Phase 2: KI-Integration
- [ ] KI-Feedback-Service
- [ ] Dynamische Erklärungen
- [ ] Analyse unklarer Antworten (SCHWER-Modus)

### Phase 3: Gamification
- [ ] Highscore-System
- [ ] Statistiken & Analytics
- [ ] Achievements
- [ ] Leaderboard

### Phase 4: Erweiterungen
- [ ] Multiplayer-Modus (Duell)
- [ ] Lernmodus (ohne 3-Strikes)
- [ ] Export von Lernstatistiken (PDF)
- [ ] Push-Benachrichtigungen für tägliche Challenges

---

## 6. TECHNISCHE HINWEISE

### Performance-Optimierung
- **Lazy Loading:** Fragen werden nur bei Bedarf geladen
- **Caching:** Bereits generierte KI-Erklärungen werden gespeichert
- **Offline-Modus:** Basis-Funktionalität auch ohne Internet (IndexedDB)

### Accessibility
- **Screenreader-Support:** ARIA-Labels für alle interaktiven Elemente
- **Tastatur-Navigation:** Vollständig ohne Maus bedienbar
- **Kontrast-Verhältnisse:** WCAG 2.1 AA-konform (auch im Dark Mode)

### Security
- **Input-Validierung:** Schutz vor XSS bei Open-Text-Eingaben
- **Rate-Limiting:** Schutz vor API-Missbrauch (KI-Feedback)
- **Datenschutz:** DSGVO-konforme Speicherung von Nutzerdaten
