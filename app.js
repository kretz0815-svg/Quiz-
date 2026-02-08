// E-Commerce Quiz § - Main Application Logic
// API Configuration
const GEMINI_API_KEY = 'AIzaSyA4obUhEgeWfLDKBZcSU1xZxSs0KUGDORw';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Application State
const app = {
    currentScreen: 'splash',
    currentDifficulty: null,
    gameSession: null,
    userProfile: null,
    questionPool: [],
    darkMode: false,
    hapticEnabled: true,

    // Initialize App
    init() {
        this.loadUserProfile();
        this.loadQuestions();
        this.setupEventListeners();
        this.checkDarkMode();
        this.updateUI();
    },

    // Screen Management
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;

            // Update navigation
            this.updateNavigation(screenName);

            // Screen-specific actions
            if (screenName === 'leaderboard') {
                this.renderLeaderboard();
            } else if (screenName === 'profile') {
                this.updateProfileUI();
            }
        }
    },

    updateNavigation(activeScreen) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const mapping = {
            'home': 0,
            'quiz': 1,
            'leaderboard': 2,
            'profile': 3
        };

        const navItems = document.querySelectorAll('.nav-item');
        if (mapping[activeScreen] !== undefined && navItems[mapping[activeScreen]]) {
            navItems[mapping[activeScreen]].classList.add('active');
        }
    },

    // User Profile Management
    loadUserProfile() {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            this.userProfile = JSON.parse(saved);
        } else {
            this.userProfile = {
                id: this.generateId(),
                username: 'MasterPat',
                email: 'student@quiz.de',
                registrationDate: new Date().toISOString(),
                totalScore: 0,
                highscores: { easy: 0, medium: 0, hard: 0 },
                statistics: {
                    totalGamesPlayed: 0,
                    totalQuestionsAnswered: 0,
                    correctAnswers: 0,
                    wrongAnswers: 0,
                    averageResponseTime: 0
                },
                preferences: {
                    darkMode: false,
                    hapticFeedback: true
                }
            };
            this.saveUserProfile();
        }
    },

    saveUserProfile() {
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
        this.updateUI();
    },

    updateUI() {
        // Update total score
        const scoreElements = document.querySelectorAll('#total-score');
        scoreElements.forEach(el => {
            el.textContent = this.userProfile.totalScore;
        });

        // Update username
        const usernameElements = document.querySelectorAll('#username, #profile-username');
        usernameElements.forEach(el => {
            el.textContent = this.userProfile.username;
        });
    },

    updateProfileUI() {
        document.getElementById('total-games').textContent = this.userProfile.statistics.totalGamesPlayed;
        document.getElementById('total-questions').textContent = this.userProfile.statistics.totalQuestionsAnswered;

        const accuracy = this.userProfile.statistics.totalQuestionsAnswered > 0
            ? Math.round((this.userProfile.statistics.correctAnswers / this.userProfile.statistics.totalQuestionsAnswered) * 100)
            : 0;
        document.getElementById('accuracy').textContent = accuracy + '%';
    },

    // Question Pool Management
    loadQuestions() {
        const saved = localStorage.getItem('questionPool');
        if (saved) {
            this.questionPool = JSON.parse(saved);
        } else {
            // Load default questions from KONZEPT.md
            this.questionPool = this.getDefaultQuestions();
            this.saveQuestions();
        }
    },

    saveQuestions() {
        localStorage.setItem('questionPool', JSON.stringify(this.questionPool));
    },

    getDefaultQuestions() {
        return [
            // LEICHT
            {
                id: 'q1',
                paragraph: '§ 312j Abs. 3 BGB',
                questionText: 'Welcher Paragraph regelt die "Button-Lösung" im Online-Shop?',
                difficulty: 'easy',
                correctAnswer: '§ 312j Abs. 3 BGB',
                wrongOptions: ['§ 312i Abs. 1 BGB', '§ 312d Abs. 1 BGB', '§ 433 Abs. 2 BGB'],
                explanation: 'Richtig! § 312j Abs. 3 BGB schreibt die "Button-Lösung" vor. Das bedeutet: Der Bestell-Button muss eindeutig beschriftet sein, z.B. mit "zahlungspflichtig bestellen". So wird sichergestellt, dass Kunden wissen, dass sie mit dem Klick eine kostenpflichtige Bestellung auslösen. Das schützt vor versehentlichen Käufen!',
                category: 'BGB',
                tags: ['button-lösung', 'online-shop']
            },
            {
                id: 'q2',
                paragraph: '§ 3 Abs. 3 UWG',
                questionText: 'Wie lange muss ein Lockvogelangebot laut UWG mindestens verfügbar sein?',
                difficulty: 'easy',
                correctAnswer: '2 Tage',
                wrongOptions: ['1 Tag', '3 Tage', '1 Woche'],
                explanation: 'Genau! Nach § 3 Abs. 3 UWG (Schwarze Liste) muss beworbene Ware in der Regel mindestens 2 Tage verfügbar sein. Sonst gilt es als "Lockvogelangebot" – eine unlautere Geschäftspraxis. Der Gesetzgeber will verhindern, dass Kunden mit Angeboten angelockt werden, die gar nicht erhältlich sind.',
                category: 'UWG',
                tags: ['lockvogelangebot', 'verfügbarkeit']
            },
            {
                id: 'q3',
                paragraph: 'Art. 5 DSGVO',
                questionText: 'Welcher Artikel der DSGVO regelt den Grundsatz der Datenminimierung?',
                difficulty: 'easy',
                correctAnswer: 'Art. 5 DSGVO',
                wrongOptions: ['Art. 6 DSGVO', 'Art. 7 DSGVO', 'Art. 13 DSGVO'],
                explanation: 'Perfekt! Art. 5 DSGVO legt die Grundsätze für die Datenverarbeitung fest, darunter die "Datenminimierung". Das bedeutet: Du darfst nur so viele personenbezogene Daten erheben, wie wirklich nötig sind. Beispiel: Für eine Gastbestellung brauchst du keine Geburtsdaten!',
                category: 'DSGVO',
                tags: ['datenminimierung', 'grundsätze']
            },
            {
                id: 'q4',
                paragraph: 'BFSG',
                questionText: 'Ab wann gilt die Pflicht zur Barrierefreiheit im E-Commerce nach dem BFSG?',
                difficulty: 'easy',
                correctAnswer: '28.06.2025',
                wrongOptions: ['01.01.2024', '01.01.2025', '31.12.2025'],
                explanation: 'Richtig! Ab dem 28.06.2025 müssen Online-Shops barrierefrei sein (BFSG). Das heißt: Menschen mit Behinderungen müssen deine Website problemlos nutzen können. Ausnahme: Kleinstunternehmen (unter 10 Mitarbeiter, max. 2 Mio. € Umsatz) sind befreit.',
                category: 'Sonstige',
                tags: ['barrierefreiheit', 'bfsg']
            },
            {
                id: 'q5',
                paragraph: '§ 312g BGB',
                questionText: 'Welcher Paragraph regelt das Widerrufsrecht bei Fernabsatzverträgen?',
                difficulty: 'easy',
                correctAnswer: '§ 312g BGB',
                wrongOptions: ['§ 355 BGB', '§ 312c BGB', '§ 651h BGB'],
                explanation: 'Sehr gut! § 312g BGB regelt das Widerrufsrecht bei Fernabsatzverträgen (z.B. Online-Käufe). Kunden haben in der Regel 14 Tage Zeit, um ohne Angabe von Gründen zu widerrufen. § 355 BGB regelt nur die Ausübung des Widerrufs, nicht das Recht selbst.',
                category: 'BGB',
                tags: ['widerrufsrecht', 'fernabsatz']
            },

            // MITTEL
            {
                id: 'q6',
                paragraph: 'Art. 246a EGBGB',
                questionText: 'Welche Informationspflicht gilt laut Art. 246a EGBGB NICHT im Fernabsatz?',
                difficulty: 'medium',
                correctAnswer: 'Angabe der Schuhgröße des Verkäufers',
                wrongOptions: ['Wesentliche Eigenschaften der Ware', 'Zahlungs- und Lieferbedingungen', 'Informationen zum Widerrufsrecht'],
                explanation: 'Korrekt! Art. 246a EGBGB listet die Informationspflichten auf – aber die Schuhgröße des Verkäufers gehört natürlich nicht dazu! 😊 Wichtig sind: Produkteigenschaften, Preise, Zahlungs-/Lieferbedingungen und das Widerrufsrecht. Diese Infos müssen klar und verständlich sein.',
                category: 'EGBGB',
                tags: ['informationspflichten', 'fernabsatz']
            },
            {
                id: 'q7',
                paragraph: '§ 312a Abs. 4 BGB',
                questionText: 'Warum ist Sofortüberweisung als alleinige unentgeltliche Zahlungsart unzulässig?',
                difficulty: 'medium',
                correctAnswer: 'Datenschutzbedenken',
                wrongOptions: ['Zu hohe Gebühren', 'Technische Unzuverlässigkeit', 'Fehlende EU-Zulassung'],
                explanation: 'Genau! Der BGH hat 2017 entschieden: Sofortüberweisung allein reicht nicht, weil dabei sensible Kontodaten an Dritte weitergegeben werden (Datenschutzproblem). Du musst mindestens eine weitere kostenlose Zahlungsart anbieten, z.B. Lastschrift oder Rechnung.',
                category: 'BGB',
                tags: ['zahlungsarten', 'datenschutz']
            },
            {
                id: 'q8',
                paragraph: '§ 312g Abs. 9 BGB',
                questionText: 'Welche Ausnahme vom Widerrufsrecht gilt bei Reisebuchungen?',
                difficulty: 'medium',
                correctAnswer: 'Beherbergung/Beförderung zu spezifischen Terminen',
                wrongOptions: ['Alle Reisen unter 100 €', 'Nur Flugreisen', 'Reisen ins EU-Ausland'],
                explanation: 'Richtig! Bei Reisen mit festem Termin (z.B. Hotelübernachtung am 15.08.) gibt es kein Widerrufsrecht nach § 312g Abs. 9 BGB. Stattdessen greift § 651h BGB: Du kannst vor Reisebeginn zurücktreten, musst aber eine Entschädigung zahlen. Das schützt Anbieter vor kurzfristigen Stornierungen.',
                category: 'BGB',
                tags: ['widerrufsrecht', 'reisen']
            },
            {
                id: 'q9',
                paragraph: '§ 11 PAngV',
                questionText: 'Was muss laut § 11 PAngV bei Preiswerbung mit Ermäßigungen angegeben werden?',
                difficulty: 'medium',
                correctAnswer: 'Niedrigster Preis der letzten 30 Tage',
                wrongOptions: ['Durchschnittspreis der letzten 12 Monate', 'Ursprünglicher Herstellerpreis', 'Preis des günstigsten Konkurrenten'],
                explanation: 'Perfekt! Seit 2022 gilt: Wenn du mit "Rabatt" wirbst, musst du den niedrigsten Preis der letzten 30 Tage angeben. So sollen Fake-Rabatte verhindert werden (z.B. Preis kurz vor dem Sale künstlich erhöhen). Transparenz für Verbraucher!',
                category: 'PAngV',
                tags: ['preisangaben', 'rabatte']
            },
            {
                id: 'q10',
                paragraph: '§ 312i Abs. 1 Nr. 3 BGB',
                questionText: 'Welche Pflicht ergibt sich aus § 312i Abs. 1 Nr. 3 BGB?',
                difficulty: 'medium',
                correctAnswer: 'Unverzügliche elektronische Bestellbestätigung',
                wrongOptions: ['Versand innerhalb von 24 Stunden', 'Telefonische Rückbestätigung', 'Zusendung einer schriftlichen Rechnung'],
                explanation: 'Sehr gut! Nach § 312i Abs. 1 Nr. 3 BGB musst du den Zugang einer Bestellung unverzüglich elektronisch bestätigen (z.B. per E-Mail). Das gibt dem Kunden Sicherheit, dass seine Bestellung angekommen ist. "Unverzüglich" heißt: ohne schuldhaftes Zögern, also idealerweise sofort automatisiert.',
                category: 'BGB',
                tags: ['bestellbestätigung', 'fernabsatz']
            },

            // SCHWER
            {
                id: 'q11',
                paragraph: '§ 151 BGB',
                questionText: 'Nenne den Paragraphen, der regelt, dass ein Vertrag auch ohne ausdrückliche Annahmeerklärung zustande kommen kann, wenn dies der Verkehrssitte entspricht.',
                difficulty: 'hard',
                correctAnswer: '§ 151 BGB',
                wrongOptions: [],
                explanation: 'Exzellent! § 151 BGB besagt: Wenn es üblich ist (Verkehrssitte), kann ein Vertrag auch ohne ausdrückliche "Ja, ich nehme an"-Erklärung zustande kommen. Beispiel: Du bestellst online, der Shop verschickt die Ware einfach – das gilt als konkludente Annahme. Wichtig im E-Commerce!',
                category: 'BGB',
                tags: ['vertragsschluss', 'verkehrssitte']
            },
            {
                id: 'q12',
                paragraph: '§ 433 Abs. 2 BGB',
                questionText: 'Welcher Paragraph des BGB definiert die Pflichten des Käufers (Zahlung und Abnahme)?',
                difficulty: 'hard',
                correctAnswer: '§ 433 Abs. 2 BGB',
                wrongOptions: [],
                explanation: 'Perfekt! § 433 Abs. 2 BGB ist das Gegenstück zu Abs. 1 (Verkäuferpflichten). Der Käufer muss den Kaufpreis zahlen UND die Ware abnehmen. "Abnehmen" bedeutet: Die Ware entgegennehmen und den Besitz übernehmen. Beides sind Hauptpflichten im Kaufvertrag!',
                category: 'BGB',
                tags: ['kaufvertrag', 'käuferpflichten']
            },
            {
                id: 'q13',
                paragraph: 'Art. 6 Abs. 1 lit. f DSGVO',
                questionText: 'Welcher Artikel der DSGVO ermöglicht die Datenverarbeitung aufgrund eines "berechtigten Interesses" (z.B. bei Bonitätsprüfung)?',
                difficulty: 'hard',
                correctAnswer: 'Art. 6 Abs. 1 lit. f DSGVO',
                wrongOptions: [],
                explanation: 'Hervorragend! Art. 6 Abs. 1 lit. f DSGVO erlaubt Datenverarbeitung, wenn ein "berechtigtes Interesse" vorliegt – z.B. Bonitätsprüfung zur Vermeidung von Zahlungsausfällen. ABER: Das Interesse muss gegen die Rechte des Betroffenen abgewogen werden. Nicht alles ist erlaubt!',
                category: 'DSGVO',
                tags: ['rechtsgrundlage', 'berechtigtes-interesse']
            },
            {
                id: 'q14',
                paragraph: '§ 5 UWG',
                questionText: 'Nenne den Paragraphen des UWG, der irreführende geschäftliche Handlungen verbietet.',
                difficulty: 'hard',
                correctAnswer: '§ 5 UWG',
                wrongOptions: [],
                explanation: 'Richtig! § 5 UWG verbietet irreführende Werbung und Geschäftspraktiken. Beispiele: Falsche Produktangaben, erfundene Testergebnisse, irreführende Preise. Ergänzung: § 5a UWG regelt die Irreführung durch Unterlassen (wenn du wichtige Infos verschweigst).',
                category: 'UWG',
                tags: ['irreführung', 'werbung']
            },
            {
                id: 'q15',
                paragraph: '§ 929 BGB',
                questionText: 'Welcher Paragraph regelt die Eigentumsübertragung durch Einigung und Übergabe?',
                difficulty: 'hard',
                correctAnswer: '§ 929 BGB',
                wrongOptions: [],
                explanation: 'Exzellent! § 929 BGB ist DER Paragraph für Eigentumsübertragung bei beweglichen Sachen. Es braucht zwei Dinge: 1) Einigung (beide wollen, dass Eigentum übergeht) und 2) Übergabe (physische Besitzübertragung). Im E-Commerce: Einigung beim Kaufvertrag, Übergabe bei Lieferung!',
                category: 'BGB',
                tags: ['eigentum', 'übergabe']
            },

            // === ZUSÄTZLICHE FRAGEN (LEICHT) ===
            {
                id: 'q16',
                paragraph: '§ 110 BGB',
                questionText: 'Welcher Paragraph regelt den sogenannten "Taschengeldparagrafen"?',
                difficulty: 'easy',
                correctAnswer: '§ 110 BGB',
                wrongOptions: ['§ 147 BGB', '§ 151 BGB', '§ 433 BGB'],
                explanation: 'Richtig! § 110 BGB ist der "Taschengeldparagraf". Er erlaubt Minderjährigen, Verträge mit ihrem Taschengeld wirksam abzuschließen, wenn sie die Leistung mit eigenen Mitteln bewirken. Wichtig für kleine Online-Käufe von Jugendlichen!',
                category: 'BGB',
                tags: ['taschengeld', 'minderjährige']
            },
            {
                id: 'q17',
                paragraph: '§ 147 BGB',
                questionText: 'Ein Antrag unter Anwesenden muss sofort angenommen werden. Welcher Paragraph ist das?',
                difficulty: 'easy',
                correctAnswer: '§ 147 BGB',
                wrongOptions: ['§ 312c BGB', '§ 929 BGB', '§ 110 BGB'],
                explanation: 'Perfekt! § 147 BGB regelt die Annahmefrist. Bei Anwesenden (z.B. Telefongespräch, Video-Call) muss der Antrag sofort angenommen werden, sonst erlischt er. Bei Abwesenden gilt die normale Übermittlungszeit.',
                category: 'BGB',
                tags: ['vertragsschluss', 'annahme']
            },
            {
                id: 'q18',
                paragraph: '§ 151 BGB',
                questionText: 'Wo ist die Annahme ohne Erklärung gegenüber dem Antragenden (z.B. Warenversand) geregelt?',
                difficulty: 'easy',
                correctAnswer: '§ 151 BGB',
                wrongOptions: ['§ 147 BGB', '§ 312i BGB', '§ 355 BGB'],
                explanation: 'Genau! § 151 BGB erlaubt konkludente Annahme durch Handlung (z.B. Warenversand) ohne ausdrückliche Erklärung, wenn dies der Verkehrssitte entspricht. Typisch im E-Commerce!',
                category: 'BGB',
                tags: ['vertragsschluss', 'konkludent']
            },
            {
                id: 'q19',
                paragraph: '§ 312a Abs. 4 BGB',
                questionText: 'Welcher Paragraph fordert eine gängige und unentgeltliche Zahlungsmöglichkeit?',
                difficulty: 'easy',
                correctAnswer: '§ 312a Abs. 4 BGB',
                wrongOptions: ['§ 312j Abs. 3 BGB', 'Art. 246a EGBGB', '§ 3 UWG'],
                explanation: 'Richtig! § 312a Abs. 4 BGB verlangt mindestens eine gängige, zumutbare und unentgeltliche Zahlungsart. Du darfst nicht nur kostenpflichtige Optionen anbieten!',
                category: 'BGB',
                tags: ['zahlungsarten', 'verbraucherschutz']
            },
            {
                id: 'q20',
                paragraph: '§ 312c Abs. 1 BGB',
                questionText: 'Wo findet man die gesetzliche Definition von Fernabsatzverträgen?',
                difficulty: 'easy',
                correctAnswer: '§ 312c Abs. 1 BGB',
                wrongOptions: ['§ 312g BGB', '§ 312d BGB', '§ 5 UWG'],
                explanation: 'Perfekt! § 312c Abs. 1 BGB definiert Fernabsatzverträge als Verträge zwischen Unternehmer und Verbraucher unter ausschließlicher Verwendung von Fernkommunikationsmitteln (z.B. Online-Shop, Telefon).',
                category: 'BGB',
                tags: ['fernabsatz', 'definition']
            },
            {
                id: 'q21',
                paragraph: '§ 312d Abs. 1 BGB',
                questionText: 'Welcher Paragraph im BGB verweist für Informationspflichten auf das EGBGB?',
                difficulty: 'easy',
                correctAnswer: '§ 312d Abs. 1 BGB',
                wrongOptions: ['§ 312g BGB', '§ 355 BGB', '§ 433 BGB'],
                explanation: 'Sehr gut! § 312d Abs. 1 BGB verweist auf Art. 246a EGBGB für die detaillierten Informationspflichten im Fernabsatz. Dort findest du alle Pflichtangaben!',
                category: 'BGB',
                tags: ['informationspflichten', 'verweis']
            },
            {
                id: 'q22',
                paragraph: '§ 312g Abs. 9 BGB',
                questionText: 'Wo ist die Ausnahme vom Widerrufsrecht für terminierte Beherbergung/Beförderung geregelt?',
                difficulty: 'easy',
                correctAnswer: '§ 312g Abs. 9 BGB',
                wrongOptions: ['§ 312c BGB', '§ 651h BGB', '§ 3 UWG'],
                explanation: 'Richtig! § 312g Abs. 9 BGB schließt das Widerrufsrecht bei Reisen mit festem Termin aus (z.B. Hotelübernachtung am 15.08.). Stattdessen gilt § 651h BGB mit Rücktrittsrecht gegen Entschädigung.',
                category: 'BGB',
                tags: ['widerrufsrecht', 'ausnahmen']
            },
            {
                id: 'q23',
                paragraph: '§ 312i Abs. 1 Nr. 3 BGB',
                questionText: 'Welcher Paragraph verlangt die unverzügliche elektronische Bestätigung des Bestelleingangs?',
                difficulty: 'easy',
                correctAnswer: '§ 312i Abs. 1 Nr. 3 BGB',
                wrongOptions: ['§ 312j Abs. 2 BGB', '§ 151 BGB', '§ 147 BGB'],
                explanation: 'Genau! § 312i Abs. 1 Nr. 3 BGB fordert die sofortige elektronische Bestätigung des Bestelleingangs (z.B. automatische E-Mail). Das gibt dem Kunden Sicherheit!',
                category: 'BGB',
                tags: ['bestellbestätigung', 'pflichten']
            },
            {
                id: 'q24',
                paragraph: '§ 312j Abs. 2 BGB',
                questionText: 'Wo ist die Übersicht der Bestellung unmittelbar vor dem Kaufabschluss geregelt?',
                difficulty: 'easy',
                correctAnswer: '§ 312j Abs. 2 BGB',
                wrongOptions: ['§ 312j Abs. 3 BGB', 'Art. 246a EGBGB', '§ 5a UWG'],
                explanation: 'Richtig! § 312j Abs. 2 BGB verlangt eine klare Übersicht aller Bestelldaten vor dem finalen Klick. Der Kunde muss alles nochmal prüfen können!',
                category: 'BGB',
                tags: ['bestellprozess', 'transparenz']
            },
            {
                id: 'q25',
                paragraph: '§ 355 Abs. 1 BGB',
                questionText: 'Gemäß § 355 Abs. 1 BGB bedarf der Widerruf welcher Bedingung?',
                difficulty: 'easy',
                correctAnswer: 'Keine Begründung nötig',
                wrongOptions: ['Schriftliche Begründung', 'Unterschrift des Händlers', 'Nur bei defekter Ware'],
                explanation: 'Perfekt! § 355 Abs. 1 BGB stellt klar: Der Widerruf braucht KEINE Begründung. Der Verbraucher kann einfach "Ich widerrufe" sagen – fertig!',
                category: 'BGB',
                tags: ['widerruf', 'formvorschriften']
            },
            {
                id: 'q26',
                paragraph: '§ 433 Abs. 2 BGB',
                questionText: 'Wo sind die Pflichten des Käufers (Zahlung/Abnahme) definiert?',
                difficulty: 'easy',
                correctAnswer: '§ 433 Abs. 2 BGB',
                wrongOptions: ['§ 433 Abs. 1 BGB', '§ 929 BGB', '§ 110 BGB'],
                explanation: 'Sehr gut! § 433 Abs. 2 BGB regelt die Käuferpflichten: Kaufpreis zahlen UND Ware abnehmen. Beides sind Hauptpflichten im Kaufvertrag!',
                category: 'BGB',
                tags: ['kaufvertrag', 'pflichten']
            },
            {
                id: 'q27',
                paragraph: '§ 651h BGB',
                questionText: 'Welcher Paragraph regelt den Rücktritt vor Reisebeginn gegen Entschädigung?',
                difficulty: 'easy',
                correctAnswer: '§ 651h BGB',
                wrongOptions: ['§ 312g BGB', '§ 355 BGB', '§ 147 BGB'],
                explanation: 'Richtig! § 651h BGB erlaubt den Rücktritt von Pauschalreisen vor Reisebeginn, aber der Veranstalter kann eine Entschädigung verlangen. Das ist KEIN Widerrufsrecht!',
                category: 'BGB',
                tags: ['reiserecht', 'rücktritt']
            },
            {
                id: 'q28',
                paragraph: 'Art. 246a § 1 Abs. 1 Nr. 1 EGBGB',
                questionText: 'Welcher Artikel fordert die Information über wesentliche Eigenschaften der Ware?',
                difficulty: 'easy',
                correctAnswer: 'Art. 246a § 1 Abs. 1 Nr. 1 EGBGB',
                wrongOptions: ['Art. 246a § 1 Abs. 1 Nr. 7 EGBGB', 'Art. 5 DSGVO', '§ 5 UWG'],
                explanation: 'Genau! Art. 246a § 1 Abs. 1 Nr. 1 EGBGB verlangt klare Infos über die wesentlichen Eigenschaften der Ware (Größe, Farbe, Material, Funktionen etc.).',
                category: 'EGBGB',
                tags: ['informationspflichten', 'produktangaben']
            },
            {
                id: 'q29',
                paragraph: 'Art. 246a § 1 Abs. 1 Nr. 7 EGBGB',
                questionText: 'Wo stehen die Informationspflichten zu Zahlungs- und Lieferbedingungen im EGBGB?',
                difficulty: 'easy',
                correctAnswer: 'Art. 246a § 1 Abs. 1 Nr. 7 EGBGB',
                wrongOptions: ['Art. 246a § 1 Abs. 1 Nr. 1', 'Art. 6 Abs. 1', '§ 11 PAngV'],
                explanation: 'Perfekt! Art. 246a § 1 Abs. 1 Nr. 7 EGBGB fordert Infos zu Zahlungs-, Liefer- und Leistungsbedingungen sowie Terminen. Transparenz ist Pflicht!',
                category: 'EGBGB',
                tags: ['informationspflichten', 'lieferbedingungen']
            },
            {
                id: 'q30',
                paragraph: '§ 3 UWG',
                questionText: 'Was regelt § 3 UWG als Generalklausel?',
                difficulty: 'easy',
                correctAnswer: 'Verbot unlauterer geschäftlicher Handlungen',
                wrongOptions: ['Preisangaben', 'Impressumspflicht', 'Widerrufsrecht'],
                explanation: 'Richtig! § 3 UWG ist die Generalklausel: Unlautere geschäftliche Handlungen sind verboten. Das ist die Basis des Wettbewerbsrechts!',
                category: 'UWG',
                tags: ['generalklausel', 'lauterkeit']
            },
            {
                id: 'q31',
                paragraph: '§ 3 Abs. 3 UWG',
                questionText: 'Wo findet man das Verbot von Lockvogelangeboten ("Schwarze Liste")?',
                difficulty: 'easy',
                correctAnswer: '§ 3 Abs. 3 UWG',
                wrongOptions: ['§ 5 UWG', '§ 11 PAngV', '§ 110 BGB'],
                explanation: 'Genau! § 3 Abs. 3 UWG verweist auf die "Schwarze Liste" im Anhang – dort sind besonders krasse unlautere Praktiken wie Lockvogelangebote aufgelistet.',
                category: 'UWG',
                tags: ['schwarze-liste', 'lockvogelangebote']
            },
            {
                id: 'q32',
                paragraph: '§ 5a Abs. 3 UWG',
                questionText: 'Wo ist die Irreführung durch Unterlassen geregelt?',
                difficulty: 'easy',
                correctAnswer: '§ 5a Abs. 3 UWG',
                wrongOptions: ['§ 5 UWG', '§ 3 Abs. 3 UWG', 'Art. 5 DSGVO'],
                explanation: 'Richtig! § 5a Abs. 3 UWG verbietet Irreführung durch Verschweigen wichtiger Informationen. Auch was du NICHT sagst, kann unlauter sein!',
                category: 'UWG',
                tags: ['irreführung', 'unterlassen']
            },
            {
                id: 'q33',
                paragraph: '§ 11 PAngV',
                questionText: 'Welcher Paragraph regelt die Werbung mit Preisermäßigungen (30-Tage-Regel)?',
                difficulty: 'easy',
                correctAnswer: '§ 11 PAngV',
                wrongOptions: ['§ 4 Abs. 2 PAngV', '§ 5 UWG', '§ 312j BGB'],
                explanation: 'Perfekt! § 11 PAngV schreibt vor: Bei Rabatt-Werbung musst du den niedrigsten Preis der letzten 30 Tage angeben. Schluss mit Fake-Rabatten!',
                category: 'PAngV',
                tags: ['preisangaben', '30-tage-regel']
            },
            {
                id: 'q34',
                paragraph: 'PAngV',
                questionText: 'Was fordert die Preisangabenverordnung (PAngV) allgemein?',
                difficulty: 'easy',
                correctAnswer: 'Preiswahrheit und Klarheit (Endpreise/Grundpreise)',
                wrongOptions: ['Datenschutz', '14 Tage Widerrufsrecht', 'Produkthaftung'],
                explanation: 'Genau! Die PAngV fordert Preiswahrheit und -klarheit: Endpreise inkl. MwSt., Grundpreise (€/kg, €/l) und keine versteckten Kosten!',
                category: 'PAngV',
                tags: ['preisangaben', 'transparenz']
            },
            {
                id: 'q35',
                paragraph: 'Art. 6 Abs. 1 lit. f DSGVO',
                questionText: 'Auf welcher Basis (DSGVO) wird meist die Bonitätsprüfung durchgeführt?',
                difficulty: 'easy',
                correctAnswer: 'Art. 6 Abs. 1 lit. f (Berechtigtes Interesse)',
                wrongOptions: ['Art. 5 Abs. 1', '§ 110 BGB', '§ 3 UWG'],
                explanation: 'Richtig! Art. 6 Abs. 1 lit. f DSGVO erlaubt Datenverarbeitung bei "berechtigtem Interesse" – z.B. Bonitätsprüfung zur Vermeidung von Zahlungsausfällen.',
                category: 'DSGVO',
                tags: ['rechtsgrundlage', 'bonitätsprüfung']
            },

            // === ZUSÄTZLICHE FRAGEN (MITTEL) ===
            {
                id: 'q36',
                paragraph: '§ 1 Abs. 1 ProdHaftG',
                questionText: 'Wo ist die verschuldensunabhängige Produkthaftung des Herstellers geregelt?',
                difficulty: 'medium',
                correctAnswer: '§ 1 Abs. 1 ProdHaftG',
                wrongOptions: ['§ 433 BGB', '§ 823 BGB', 'BFSG'],
                explanation: 'Genau! § 1 Abs. 1 ProdHaftG regelt die Gefährdungshaftung: Der Hersteller haftet für Produktfehler OHNE Verschulden – strenge Haftung zum Verbraucherschutz!',
                category: 'Sonstige',
                tags: ['produkthaftung', 'hersteller']
            },
            {
                id: 'q37',
                paragraph: 'BFSG',
                questionText: 'Welches Gesetz regelt die Barrierefreiheit im E-Commerce ab 2025?',
                difficulty: 'medium',
                correctAnswer: 'BFSG',
                wrongOptions: ['DDG', 'ElektroG', 'UrhG'],
                explanation: 'Richtig! Das BFSG (Barrierefreiheitsstärkungsgesetz) verpflichtet ab 28.06.2025 zur digitalen Barrierefreiheit – außer bei Kleinstunternehmen!',
                category: 'Sonstige',
                tags: ['barrierefreiheit', 'inklusion']
            },
            {
                id: 'q38',
                paragraph: '§ 3 Abs. 3 BFSG',
                questionText: 'Wer ist laut § 3 Abs. 3 BFSG von der Barrierefreiheit befreit?',
                difficulty: 'medium',
                correctAnswer: 'Kleinstunternehmen (<10 MA, <2 Mio. € Umsatz)',
                wrongOptions: ['Großkonzerne', 'Gemeinnützige Vereine', 'Ausländische Händler'],
                explanation: 'Perfekt! § 3 Abs. 3 BFSG befreit Kleinstunternehmen (unter 10 Mitarbeiter, max. 2 Mio. € Umsatz) von der Barrierefreiheitspflicht – Verhältnismäßigkeit!',
                category: 'Sonstige',
                tags: ['ausnahmen', 'kleinstunternehmen']
            },
            {
                id: 'q39',
                paragraph: '§ 73 PostG',
                questionText: 'Was fordert § 73 PostG (Novelle) für schwere Pakete?',
                difficulty: 'medium',
                correctAnswer: 'Kennzeichnungspflicht (Gewichtsstufen)',
                wrongOptions: ['Kostenloser Versand', 'Verbot über 20 kg', 'Expresszustellung'],
                explanation: 'Richtig! § 73 PostG (neu) verlangt Kennzeichnung bei Paketen: 10-20 kg und >20 kg müssen markiert sein – Schutz der Zusteller!',
                category: 'Sonstige',
                tags: ['paketversand', 'kennzeichnung']
            },
            {
                id: 'q40',
                paragraph: 'DDG',
                questionText: 'Welches Gesetz löste das TMG für die Impressumspflicht ab?',
                difficulty: 'medium',
                correctAnswer: 'DDG (Digitale-Dienste-Gesetz)',
                wrongOptions: ['DSGVO', 'PAngV', 'UWG'],
                explanation: 'Genau! Das DDG (Digitale-Dienste-Gesetz) hat seit 14.05.2024 das TMG abgelöst und regelt jetzt die Impressumspflicht für Online-Dienste!',
                category: 'Sonstige',
                tags: ['impressum', 'ddg']
            },
            {
                id: 'q41',
                paragraph: 'ElektroG',
                questionText: 'Welches Gesetz regelt die Rücknahmepflicht für Elektro-Altgeräte?',
                difficulty: 'medium',
                correctAnswer: 'ElektroG',
                wrongOptions: ['Batteriegesetz', 'Verpackungsgesetz', 'Elektro-UrhG'],
                explanation: 'Richtig! Das ElektroG (Elektro- und Elektronikgerätegesetz) verpflichtet Händler zur kostenlosen Rücknahme von Altgeräten – Umweltschutz!',
                category: 'Sonstige',
                tags: ['rücknahme', 'elektroschrott']
            },
            {
                id: 'q42',
                paragraph: 'JuSchG',
                questionText: 'Welches Gesetz dient dem Schutz vor altersunsachgemäßen Waren?',
                difficulty: 'medium',
                correctAnswer: 'JuSchG',
                wrongOptions: ['DSGVO', 'UrhG', 'PAngV'],
                explanation: 'Perfekt! Das JuSchG (Jugendschutzgesetz) schützt Minderjährige vor altersunsachgemäßen Inhalten und Waren (z.B. Alkohol, FSK-18-Medien).',
                category: 'Sonstige',
                tags: ['jugendschutz', 'altersverifikation']
            },
            {
                id: 'q43',
                paragraph: 'UrhG',
                questionText: 'Welches Gesetz schützt Produktfotos und Videos vor Kopien?',
                difficulty: 'medium',
                correctAnswer: 'UrhG (Urheberrechtsgesetz)',
                wrongOptions: ['DDG', 'UWG', 'BGB'],
                explanation: 'Genau! Das UrhG (Urheberrechtsgesetz) schützt kreative Werke wie Produktfotos, Texte und Videos vor unerlaubter Nutzung – Achtung bei Bilderklau!',
                category: 'Sonstige',
                tags: ['urheberrecht', 'bildrechte']
            },
            {
                id: 'q44',
                paragraph: 'BGH KZR 39/16',
                questionText: 'Welches BGH-Urteil (2017) verbot Sofortüberweisung als einzige Gratis-Zahlungsart?',
                difficulty: 'medium',
                correctAnswer: 'AZ.: KZR 39/16',
                wrongOptions: ['AZ.: VIII ZR 12/15', 'AZ.: I ZR 44/19', 'AZ.: C-123/20'],
                explanation: 'Richtig! BGH-Urteil KZR 39/16 (2017): Sofortüberweisung allein reicht nicht als kostenlose Zahlungsart – Datenschutzbedenken! Mindestens eine weitere Option nötig.',
                category: 'Sonstige',
                tags: ['rechtsprechung', 'zahlungsarten']
            },
            {
                id: 'q45',
                paragraph: 'Textilkennzeichnungsverordnung',
                questionText: 'Welche Verordnung schreibt Angaben zur Faserzusammensetzung vor?',
                difficulty: 'medium',
                correctAnswer: 'Textilkennzeichnungsverordnung',
                wrongOptions: ['Lebensmittelinformationsverordnung', 'Gefahrstoffverordnung', 'Buchpreisbindungsgesetz'],
                explanation: 'Perfekt! Die Textilkennzeichnungsverordnung verlangt genaue Angaben zur Faserzusammensetzung (z.B. "100% Baumwolle") – Transparenz für Verbraucher!',
                category: 'Sonstige',
                tags: ['textilien', 'kennzeichnung']
            },

            // === ZUSÄTZLICHE FRAGEN (SCHWER) ===
            {
                id: 'q46',
                paragraph: '§ 5 UWG',
                questionText: 'Welcher Paragraph verbietet irreführende geschäftliche Handlungen allgemein?',
                difficulty: 'hard',
                correctAnswer: '§ 5 UWG',
                wrongOptions: [],
                explanation: 'Exzellent! § 5 UWG ist DIE zentrale Norm gegen Irreführung: Falsche Produktangaben, erfundene Tests, irreführende Preise – alles verboten!',
                category: 'UWG',
                tags: ['irreführung', 'verbot']
            },
            {
                id: 'q47',
                paragraph: '§ 929 BGB',
                questionText: 'Welcher Paragraph beschreibt die Eigentumsübertragung durch Einigung und Übergabe?',
                difficulty: 'hard',
                correctAnswer: '§ 929 BGB',
                wrongOptions: [],
                explanation: 'Perfekt! § 929 BGB: Eigentumsübergang braucht 1) Einigung (beide wollen es) und 2) Übergabe (physischer Besitzwechsel). Grundlage des Sachenrechts!',
                category: 'BGB',
                tags: ['eigentum', 'sachenrecht']
            },
            {
                id: 'q48',
                paragraph: 'Art. 5 DSGVO',
                questionText: 'Welcher Artikel der DSGVO regelt den Grundsatz der Datenminimierung?',
                difficulty: 'hard',
                correctAnswer: 'Art. 5 DSGVO',
                wrongOptions: [],
                explanation: 'Hervorragend! Art. 5 DSGVO legt die Grundsätze fest: Datenminimierung bedeutet "so wenig wie möglich, so viel wie nötig" – Datensparsamkeit!',
                category: 'DSGVO',
                tags: ['grundsätze', 'datenminimierung']
            },
            {
                id: 'q49',
                paragraph: '§ 312j Abs. 3 BGB',
                questionText: 'Welcher Paragraph schreibt die "Button-Lösung" (eindeutige Beschriftung) vor?',
                difficulty: 'hard',
                correctAnswer: '§ 312j Abs. 3 BGB',
                wrongOptions: [],
                explanation: 'Exzellent! § 312j Abs. 3 BGB: Der Bestell-Button muss eindeutig sein, z.B. "zahlungspflichtig bestellen" – keine versteckten Kostenfallen!',
                category: 'BGB',
                tags: ['button-lösung', 'transparenz']
            },
            {
                id: 'q50',
                paragraph: '§ 312j Abs. 2 BGB',
                questionText: 'Nenne den Paragraphen, der die Bestellübersicht vor Kaufabschluss regelt.',
                difficulty: 'hard',
                correctAnswer: '§ 312j Abs. 2 BGB',
                wrongOptions: [],
                explanation: 'Perfekt! § 312j Abs. 2 BGB verlangt eine klare Zusammenfassung aller Bestelldaten VOR dem finalen Klick – letzte Kontrollmöglichkeit für den Kunden!',
                category: 'BGB',
                tags: ['bestellprozess', 'kontrolle']
            }
        ];
    },

    // Game Management
    startGame(difficulty) {
        this.currentDifficulty = difficulty;

        // Initialize game session
        this.gameSession = {
            id: this.generateId(),
            userId: this.userProfile.id,
            difficulty: difficulty,
            startTime: new Date(),
            currentQuestionIndex: 0,
            strikes: 0,
            score: 0,
            answeredQuestions: [],
            status: 'active',
            streak: 0
        };

        // Get questions for this difficulty
        const availableQuestions = this.questionPool.filter(q => q.difficulty === difficulty);
        this.gameSession.questions = this.shuffleArray([...availableQuestions]).slice(0, 10);

        // Show quiz screen
        this.showScreen('quiz');
        this.renderQuestion();
    },

    renderQuestion() {
        const session = this.gameSession;
        const question = session.questions[session.currentQuestionIndex];

        if (!question) {
            this.endGame('completed');
            return;
        }

        // Update progress
        const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
        document.getElementById('progress-text').textContent = `Frage ${session.currentQuestionIndex + 1}/${session.questions.length}`;

        // Update score
        document.getElementById('current-score').textContent = session.score;

        // Update question
        document.getElementById('question-category').textContent = question.category;
        document.getElementById('question-text').textContent = question.questionText;
        // Don't show the correct answer before the user answers!
        // document.getElementById('question-paragraph').textContent = question.paragraph;

        // Render answers based on difficulty
        if (question.difficulty === 'hard') {
            this.renderTextInput();
        } else {
            this.renderMultipleChoice(question);
        }

        // Show/hide timer for medium difficulty
        if (question.difficulty === 'medium') {
            this.startTimer();
        } else {
            document.getElementById('timer-container').style.display = 'none';
        }

        // Store question start time
        session.questionStartTime = Date.now();
    },

    renderMultipleChoice(question) {
        const container = document.getElementById('mc-answers');
        const textAnswer = document.getElementById('text-answer');

        container.style.display = 'flex';
        textAnswer.style.display = 'none';

        // Shuffle answers
        const allAnswers = [question.correctAnswer, ...question.wrongOptions];
        const shuffled = this.shuffleArray(allAnswers);

        container.innerHTML = shuffled.map(answer => `
            <button class="answer-option" onclick="app.selectAnswer('${this.escapeHtml(answer)}')">${answer}</button>
        `).join('');
    },

    renderTextInput() {
        const container = document.getElementById('mc-answers');
        const textAnswer = document.getElementById('text-answer');
        const input = document.getElementById('answer-input');

        container.style.display = 'none';
        textAnswer.style.display = 'flex';

        input.value = '';
        input.focus();

        // Allow Enter key to submit
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                this.submitTextAnswer();
            }
        };
    },

    selectAnswer(answer) {
        const session = this.gameSession;
        const question = session.questions[session.currentQuestionIndex];

        // Stop timer if running
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Calculate response time
        const responseTime = Date.now() - session.questionStartTime;

        // Check if correct
        const isCorrect = answer === question.correctAnswer;

        // Update UI
        const buttons = document.querySelectorAll('.answer-option');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === question.correctAnswer) {
                btn.classList.add('correct');
            }
            if (btn.textContent === answer && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Process answer
        setTimeout(() => {
            this.processAnswer(answer, isCorrect, responseTime);
        }, 1000);
    },

    submitTextAnswer() {
        const input = document.getElementById('answer-input');
        const answer = input.value.trim();

        if (!answer) {
            alert('Bitte gib eine Antwort ein!');
            return;
        }

        const session = this.gameSession;
        const question = session.questions[session.currentQuestionIndex];
        const responseTime = Date.now() - session.questionStartTime;

        // Normalize answers for comparison
        const normalizedAnswer = this.normalizeAnswer(answer);
        const normalizedCorrect = this.normalizeAnswer(question.correctAnswer);

        const isCorrect = normalizedAnswer === normalizedCorrect;

        this.processAnswer(answer, isCorrect, responseTime);
    },

    normalizeAnswer(text) {
        // Remove whitespace, convert to lowercase, remove special chars
        return text.toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[§.]/g, '')
            .replace(/abs\./gi, 'abs')
            .replace(/nr\./gi, 'nr');
    },

    processAnswer(userAnswer, isCorrect, responseTime) {
        const session = this.gameSession;
        const question = session.questions[session.currentQuestionIndex];

        // Calculate points
        let points = 0;
        if (isCorrect) {
            points = this.calculatePoints(question.difficulty, responseTime, session.streak);
            session.score += points;
            session.streak++;
        } else {
            session.strikes++;
            session.streak = 0;
            this.triggerHaptic('error');
        }

        // Record answer
        session.answeredQuestions.push({
            questionId: question.id,
            userAnswer: userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect,
            responseTime: responseTime,
            pointsEarned: points
        });

        // Update statistics
        this.userProfile.statistics.totalQuestionsAnswered++;
        if (isCorrect) {
            this.userProfile.statistics.correctAnswers++;
            this.triggerHaptic('success');
        } else {
            this.userProfile.statistics.wrongAnswers++;
        }

        // Show feedback
        this.showFeedback(isCorrect, question.explanation, points);

        // Check game over
        if (session.strikes >= 3) {
            setTimeout(() => {
                this.endGame('game_over');
            }, 2000);
        }
    },

    calculatePoints(difficulty, responseTime, streak) {
        const basePoints = {
            'easy': 10,
            'medium': 20,
            'hard': 50
        };

        let points = basePoints[difficulty];

        // Time bonus for medium
        if (difficulty === 'medium') {
            const timeBonus = Math.max(0, Math.floor((5000 - responseTime) / 100));
            points += timeBonus;
        }

        // Streak bonus
        if (streak >= 3) {
            points = Math.floor(points * 1.5);
        }

        return points;
    },

    showFeedback(isCorrect, explanation, points) {
        const modal = document.getElementById('feedback-modal');
        const icon = document.getElementById('feedback-icon');
        const title = document.getElementById('feedback-title');
        const text = document.getElementById('feedback-text');

        if (isCorrect) {
            icon.textContent = '✅';
            title.textContent = `Richtig! +${points} Punkte`;
        } else {
            icon.textContent = '❌';
            title.textContent = 'Leider falsch';
        }

        text.textContent = explanation;
        modal.classList.add('active');
    },

    nextQuestion() {
        const modal = document.getElementById('feedback-modal');
        modal.classList.remove('active');

        this.gameSession.currentQuestionIndex++;

        if (this.gameSession.currentQuestionIndex >= this.gameSession.questions.length) {
            this.endGame('completed');
        } else {
            this.renderQuestion();
        }
    },

    startTimer() {
        const container = document.getElementById('timer-container');
        const text = document.getElementById('timer-text');
        const progress = document.getElementById('timer-progress');

        container.style.display = 'flex';

        let timeLeft = 5;
        const totalTime = 5;

        text.textContent = timeLeft;

        this.timerInterval = setInterval(() => {
            timeLeft--;
            text.textContent = timeLeft;

            // Update progress circle
            const dashOffset = 283 - (283 * (timeLeft / totalTime));
            progress.style.strokeDashoffset = dashOffset;

            // Warning colors
            if (timeLeft <= 2) {
                progress.classList.add('warning');
            }
            if (timeLeft <= 1) {
                progress.classList.remove('warning');
                progress.classList.add('danger');
            }

            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.selectAnswer(''); // Auto-submit empty answer
            }
        }, 1000);
    },

    endGame(status) {
        const session = this.gameSession;
        session.status = status;
        session.endTime = new Date();

        // Update statistics
        this.userProfile.statistics.totalGamesPlayed++;
        this.userProfile.totalScore += session.score;

        // Update highscore
        if (session.score > this.userProfile.highscores[session.difficulty]) {
            this.userProfile.highscores[session.difficulty] = session.score;
        }

        this.saveUserProfile();

        // Show game over modal
        const modal = document.getElementById('game-over-modal');
        const icon = document.getElementById('game-over-icon');
        const title = document.getElementById('game-over-title');
        const message = document.getElementById('game-over-message');

        if (status === 'game_over') {
            icon.textContent = '💔';
            title.textContent = 'Game Over!';
            message.textContent = '3 Fehler - Versuch es nochmal!';
            this.triggerHaptic('game_over');
        } else {
            icon.textContent = '🎉';
            title.textContent = 'Geschafft!';
            message.textContent = 'Du hast alle Fragen beantwortet!';
        }

        document.getElementById('final-score').textContent = session.score;
        document.getElementById('correct-answers').textContent = session.answeredQuestions.filter(a => a.isCorrect).length;

        const accuracy = Math.round((session.answeredQuestions.filter(a => a.isCorrect).length / session.answeredQuestions.length) * 100);
        document.getElementById('final-accuracy').textContent = accuracy + '%';

        modal.classList.add('active');
    },

    restartGame() {
        const modal = document.getElementById('game-over-modal');
        modal.classList.remove('active');
        this.startGame(this.currentDifficulty);
    },

    // Leaderboard
    renderLeaderboard() {
        const list = document.getElementById('leaderboard-list');

        // Mock data for now
        const leaderboard = [
            { rank: 1, name: 'Emily Rose', score: 900, avatar: '👩', trend: '▲' },
            { rank: 2, name: 'Sophia Cba', score: 800, avatar: '👧', trend: '▲' },
            { rank: 3, name: 'Olivia Avo', score: 700, avatar: '👱‍♀️', trend: '▼' },
            { rank: 4, name: this.userProfile.username, score: this.userProfile.totalScore, avatar: '👤', trend: '▲' }
        ];

        list.innerHTML = leaderboard.map(player => `
            <div class="leaderboard-item">
                <div class="rank ${player.rank <= 3 ? 'top' : ''}">#${player.rank}</div>
                <div class="player-avatar">${player.avatar}</div>
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <div class="player-score">🏆 ${player.score}</div>
                </div>
                <div class="trend">${player.trend}</div>
            </div>
        `).join('');
    },

    filterLeaderboard(filter) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Re-render with filter
        this.renderLeaderboard();
    },

    // Dark Mode
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');

        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.textContent = this.darkMode ? '☀️' : '🌙';
        }

        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) {
            toggle.checked = this.darkMode;
        }

        this.userProfile.preferences.darkMode = this.darkMode;
        this.saveUserProfile();
    },

    checkDarkMode() {
        const saved = this.userProfile.preferences.darkMode;
        if (saved) {
            this.darkMode = true;
            document.documentElement.setAttribute('data-theme', 'dark');
            const toggle = document.getElementById('dark-mode-toggle');
            if (toggle) toggle.checked = true;
        }
    },

    // Haptic Feedback
    toggleHaptic() {
        this.hapticEnabled = !this.hapticEnabled;
        this.userProfile.preferences.hapticFeedback = this.hapticEnabled;
        this.saveUserProfile();
    },

    triggerHaptic(type) {
        if (!this.hapticEnabled || !('vibrate' in navigator)) return;

        const patterns = {
            'success': 50,
            'error': [200, 100, 200, 100, 200],
            'warning': 100,
            'game_over': [300, 200, 300, 200, 500]
        };

        navigator.vibrate(patterns[type] || 50);
    },

    // AI Question Generation
    async generateQuestions() {
        const difficulty = document.getElementById('gen-difficulty').value;
        const count = parseInt(document.getElementById('gen-count').value);
        const category = document.getElementById('gen-category').value;

        const status = document.getElementById('generator-status');
        const statusText = document.getElementById('status-text');
        const container = document.getElementById('generated-questions');

        status.style.display = 'block';
        container.innerHTML = '';

        try {
            const difficulties = difficulty === 'all' ? ['easy', 'medium', 'hard'] : [difficulty];
            const questionsPerDifficulty = Math.ceil(count / difficulties.length);

            for (const diff of difficulties) {
                statusText.textContent = `Generiere ${diff}-Fragen...`;

                const prompt = this.buildQuestionPrompt(diff, questionsPerDifficulty, category);
                const questions = await this.callGeminiAPI(prompt);

                // Add to pool
                questions.forEach(q => {
                    q.id = this.generateId();
                    this.questionPool.push(q);
                });

                // Display generated questions
                this.displayGeneratedQuestions(questions, container);
            }

            this.saveQuestions();
            statusText.textContent = `✅ ${count} Fragen erfolgreich generiert!`;

            setTimeout(() => {
                status.style.display = 'none';
            }, 2000);

        } catch (error) {
            console.error('Fehler bei der Generierung:', error);
            statusText.textContent = '❌ Fehler bei der Generierung. Bitte versuche es erneut.';
        }
    },

    buildQuestionPrompt(difficulty, count, category) {
        const categoryFilter = category ? `aus der Kategorie ${category}` : '';

        return `Generiere ${count} Quiz-Fragen zum Thema E-Commerce-Recht ${categoryFilter} mit Schwierigkeitsgrad "${difficulty}".

Schwierigkeitsgrad-Regeln:
- LEICHT: Multiple Choice mit 4 Antwortoptionen (1 richtig, 3 falsch), keine Zeitbegrenzung
- MITTEL: Multiple Choice mit 4 Antwortoptionen (1 richtig, 3 falsch), 5-Sekunden-Timer
- SCHWER: Open-Text-Input (Nutzer muss Paragraph selbst eingeben)

Relevante Paragraphen: BGB (§ 110, 147, 151, 312a-312j, 355, 433, 651h, 929), EGBGB (Art. 246a), UWG (§ 3, 5, 5a), PAngV (§ 4, 11), DSGVO (Art. 5, 6), ProdHaftG, BFSG, PostG, etc.

Antworte im folgenden JSON-Format:
{
  "questions": [
    {
      "paragraph": "§ XXX",
      "questionText": "Frage...",
      "difficulty": "${difficulty}",
      "correctAnswer": "Richtige Antwort",
      "wrongOptions": ["Falsch 1", "Falsch 2", "Falsch 3"],
      "explanation": "Motivierende, didaktisch aufbereitete Erklärung...",
      "category": "BGB|EGBGB|UWG|PAngV|DSGVO|Sonstige",
      "tags": ["tag1", "tag2"]
    }
  ]
}

Wichtig:
- Erklärungen sollen fachlich korrekt, aber motivierend und leicht verständlich sein
- Tonfall: Ermutigend, nicht belehrend
- Bei SCHWER: wrongOptions = []
- Keine Wiederholungen von bereits existierenden Fragen`;
    },

    async callGeminiAPI(prompt) {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048
                }
            })
        });

        if (!response.ok) {
            throw new Error('API-Fehler: ' + response.statusText);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Keine gültige JSON-Antwort erhalten');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.questions || [];
    },

    displayGeneratedQuestions(questions, container) {
        questions.forEach(q => {
            const div = document.createElement('div');
            div.className = 'generated-question';
            div.innerHTML = `
                <h4>${q.questionText}</h4>
                <p><strong>Paragraph:</strong> ${q.paragraph}</p>
                <p><strong>Kategorie:</strong> ${q.category} | <strong>Schwierigkeit:</strong> ${q.difficulty}</p>
                <p><strong>Richtige Antwort:</strong> ${q.correctAnswer}</p>
            `;
            container.appendChild(div);
        });
    },

    // Utility Functions
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    setupEventListeners() {
        // Update strikes display
        this.updateStrikesDisplay();
    },

    updateStrikesDisplay() {
        if (!this.gameSession) return;

        for (let i = 1; i <= 3; i++) {
            const strike = document.getElementById(`strike-${i}`);
            if (strike) {
                if (i <= this.gameSession.strikes) {
                    strike.classList.add('lost');
                } else {
                    strike.classList.remove('lost');
                }
            }
        }
    },

    editProfile() {
        const newName = prompt('Neuer Benutzername:', this.userProfile.username);
        if (newName && newName.trim()) {
            this.userProfile.username = newName.trim();
            this.saveUserProfile();
        }
    }
};

// Splash screen navigation
function showPreviousFeature() {
    const dots = document.querySelectorAll('.pagination-dots .dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === 0);
    });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
