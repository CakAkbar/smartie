document.addEventListener('DOMContentLoaded', function() {
    // Game Tebak Angka
    const mathGame = {
        questions: [
            { question: "Berapa hasil dari 5 + 3?", answer: 8, options: [7, 8, 9] },
            { question: "Berapa hasil dari 10 - 4?", answer: 6, options: [5, 6, 7] },
            { question: "Berapa hasil dari 2 × 3?", answer: 6, options: [4, 5, 6] },
            { question: "Berapa hasil dari 8 ÷ 2?", answer: 4, options: [3, 4, 5] },
            { question: "Berapa hasil dari 7 + 6?", answer: 13, options: [12, 13, 14] }
        ],
        currentQuestion: 0,
        
        init: function() {
            this.displayQuestion();
            
            // Event listener untuk tombol jawaban
            document.querySelectorAll('.answer-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const selectedAnswer = parseInt(e.target.textContent);
                    this.checkAnswer(selectedAnswer);
                });
            });
            
            // Event listener untuk tombol pertanyaan baru
            document.getElementById('new-question-btn').addEventListener('click', () => {
                this.nextQuestion();
            });
        },
        
        displayQuestion: function() {
            const question = this.questions[this.currentQuestion];
            document.getElementById('game-question').textContent = question.question;
            
            const answerBtns = document.querySelectorAll('.answer-btn');
            question.options.forEach((option, index) => {
                answerBtns[index].textContent = option;
            });
            
            document.getElementById('game-feedback').textContent = '';
        },
        
        checkAnswer: function(selectedAnswer) {
            const correctAnswer = this.questions[this.currentQuestion].answer;
            const feedback = document.getElementById('game-feedback');
            
            if (selectedAnswer === correctAnswer) {
                feedback.textContent = "Benar! Kamu hebat!";
                feedback.className = "text-success fw-bold";
                
                // Animasi ketika jawaban benar
                document.querySelectorAll('.answer-btn').forEach(btn => {
                    if (parseInt(btn.textContent) === correctAnswer) {
                        btn.classList.add('bounce');
                        setTimeout(() => {
                            btn.classList.remove('bounce');
                        }, 1000);
                    }
                });
            } else {
                feedback.textContent = "Coba lagi ya!";
                feedback.className = "text-danger fw-bold";
            }
        },
        
        nextQuestion: function() {
            this.currentQuestion = (this.currentQuestion + 1) % this.questions.length;
            this.displayQuestion();
        }
    };
    
    // Game Susun Kata
    const wordGame = {
        words: [
            { word: "apel", hint: "nama buah merah atau hijau yang renyah" },
            { word: "mangga", hint: "nama buah kuning yang manis" },
            { word: "jeruk", hint: "nama buah bulat berwarna oranye" },
            { word: "pisang", hint: "nama buah panjang berwarna kuning" },
            { word: "anggur", hint: "nama buah kecil-kecil bergerombol" }
        ],
        currentWord: "",
        scrambledLetters: [],
        
        init: function() {
            this.newWord();
            
            // Event listener untuk tombol kata baru
            document.getElementById('new-word-btn').addEventListener('click', () => {
                this.newWord();
            });
            
            // Event listener untuk tombol periksa
            document.getElementById('check-word-btn').addEventListener('click', () => {
                this.checkWord();
            });
            
            // Event listener untuk huruf yang bisa diseret
            this.setupDragAndDrop();
        },
        
        newWord: function() {
            // Pilih kata acak
            const randomIndex = Math.floor(Math.random() * this.words.length);
            this.currentWord = this.words[randomIndex];
            
            // Acak huruf-hurufnya
            this.scrambledLetters = this.shuffleArray([...this.currentWord.word]);
            
            // Tampilkan huruf acak
            const lettersContainer = document.getElementById('scramble-letters');
            lettersContainer.innerHTML = '';
            
            this.scrambledLetters.forEach((letter, index) => {
                const letterElement = document.createElement('div');
                letterElement.className = "letter-tile btn btn-outline-primary";
                letterElement.textContent = letter;
                letterElement.draggable = true;
                letterElement.dataset.index = index;
                lettersContainer.appendChild(letterElement);
            });
            
            // Buat slot jawaban
            const answerSlots = document.getElementById('answer-slots');
            answerSlots.innerHTML = '';
            
            for (let i = 0; i < this.currentWord.word.length; i++) {
                const slot = document.createElement('div');
                slot.className = "answer-slot";
                slot.dataset.position = i;
                answerSlots.appendChild(slot);
            }
            
            // Update petunjuk
            document.querySelector('#word-game p').textContent = `Susunlah huruf-huruf ini menjadi nama buah: ${this.currentWord.hint}`;
            
            // Reset feedback
            document.getElementById('word-feedback').textContent = '';
        },
        
        shuffleArray: function(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        },
        
        setupDragAndDrop: function() {
            const lettersContainer = document.getElementById('scramble-letters');
            const answerSlots = document.getElementById('answer-slots');
            
            lettersContainer.addEventListener('dragstart', (e) => {
                if (e.target.classList.contains('letter-tile')) {
                    e.dataTransfer.setData('text/plain', e.target.dataset.index);
                    setTimeout(() => {
                        e.target.classList.add('dragging');
                    }, 0);
                }
            });
            
            lettersContainer.addEventListener('dragend', (e) => {
                if (e.target.classList.contains('letter-tile')) {
                    e.target.classList.remove('dragging');
                }
            });
            
            answerSlots.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (e.target.classList.contains('answer-slot')) {
                    e.target.classList.add('drag-over');
                }
            });
            
            answerSlots.addEventListener('dragleave', (e) => {
                if (e.target.classList.contains('answer-slot')) {
                    e.target.classList.remove('drag-over');
                }
            });
            
            answerSlots.addEventListener('drop', (e) => {
                e.preventDefault();
                if (e.target.classList.contains('answer-slot')) {
                    e.target.classList.remove('drag-over');
                    
                    const letterIndex = e.dataTransfer.getData('text/plain');
                    const letterTile = document.querySelector(`.letter-tile[data-index="${letterIndex}"]`);
                    
                    // Jika slot sudah berisi huruf, kembalikan ke tempat asal
                    if (e.target.hasChildNodes()) {
                        const existingLetter = e.target.firstChild;
                        lettersContainer.appendChild(existingLetter);
                    }
                    
                    // Pindahkan huruf ke slot
                    e.target.appendChild(letterTile);
                }
            });
        },
        
        checkWord: function() {
            const answerSlots = document.getElementById('answer-slots');
            const slots = answerSlots.querySelectorAll('.answer-slot');
            let userAnswer = '';
            
            slots.forEach(slot => {
                if (slot.firstChild) {
                    userAnswer += slot.firstChild.textContent;
                }
            });
            
            const feedback = document.getElementById('word-feedback');
            
            if (userAnswer === this.currentWord.word) {
                feedback.textContent = "Hore! Kamu benar!";
                feedback.className = "text-success fw-bold";
                
                // Animasi ketika jawaban benar
                slots.forEach(slot => {
                    if (slot.firstChild) {
                        slot.firstChild.classList.add('bounce');
                        setTimeout(() => {
                            slot.firstChild.classList.remove('bounce');
                        }, 1000);
                    }
                });
            } else {
                feedback.textContent = "Belum tepat, coba lagi ya!";
                feedback.className = "text-danger fw-bold";
            }
        }
    };
    
    // Inisialisasi game
    mathGame.init();
    wordGame.init();
    
    // Tambahan efek hover untuk tombol
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    });
});

// Tambahkan ini di dalam DOMContentLoaded

    // Game Tebak Suara
// Game Tebak Suara Hewan
const audioGame = {
    questions: [
        { 
            word: "ayam", 
            hint: "hewan berkaki dua yang berkokok",
            audioUrl: "https://www.soundjay.com/animal/sounds/chicken-01.mp3" 
        },
        { 
            word: "kucing", 
            hint: "hewan berbulu yang suka mengeong",
            audioUrl: "https://www.soundjay.com/animal/sounds/cat-01.mp3" 
        },
        { 
            word: "anjing", 
            hint: "hewan setia yang suka menggonggong",
            audioUrl: "https://www.soundjay.com/animal/sounds/dog-01.mp3" 
        },
        { 
            word: "sapi", 
            hint: "hewan besar yang memberi kita susu",
            audioUrl: "https://www.soundjay.com/animal/sounds/cow-01.mp3" 
        },
        { 
            word: "burung", 
            hint: "hewan yang bisa terbang dan berkicau",
            audioUrl: "https://www.soundjay.com/animal/sounds/bird-01.mp3" 
        }
    ],
    currentQuestion: 0,
    audioElement: new Audio(),
    
    init: function() {
        // Event listener untuk tombol putar suara
        document.getElementById('play-audio-btn').addEventListener('click', () => {
            this.playAnimalSound();
        });
        
        // Event listener untuk tombol periksa jawaban
        document.getElementById('submit-audio-btn').addEventListener('click', () => {
            this.checkAnswer();
        });
        
        // Event listener untuk tombol soal baru
        document.getElementById('new-audio-btn').addEventListener('click', () => {
            this.nextQuestion();
        });
        
        // Event listener untuk input (bisa pakai enter)
        document.getElementById('audio-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
        
        // Event saat audio siap diputar
        this.audioElement.addEventListener('canplaythrough', () => {
            document.getElementById('play-audio-btn').disabled = false;
        });
    },
    
    playAnimalSound: function() {
        // Matikan audio jika sedang diputar
        this.audioElement.pause();
        
        // Set sumber audio baru
        const currentQuestion = this.questions[this.currentQuestion];
        this.audioElement.src = currentQuestion.audioUrl;
        
        // Nonaktifkan tombol sementara
        document.getElementById('play-audio-btn').disabled = true;
        
        // Coba memutar audio
        this.audioElement.play().catch(error => {
            console.error("Error memutar audio:", error);
            alert("Gagal memutar suara. Silakan coba lagi.");
            document.getElementById('play-audio-btn').disabled = false;
        });
    },
    
    checkAnswer: function() {
        const userAnswer = document.getElementById('audio-answer').value.toLowerCase().trim();
        const correctAnswer = this.questions[this.currentQuestion].word;
        const feedback = document.getElementById('audio-feedback');
        
        if (userAnswer === correctAnswer) {
            feedback.textContent = "Hebat! Jawaban kamu benar! 🎉";
            feedback.className = "text-success fw-bold";
            
            // Animasi feedback
            feedback.classList.add('bounce');
            setTimeout(() => {
                feedback.classList.remove('bounce');
            }, 1000);
            
            // Mainkan suara lagi sebagai reward
            this.playAnimalSound();
        } else {
            feedback.textContent = `Jawaban salah. Coba lagi! Hint: ${this.questions[this.currentQuestion].hint}`;
            feedback.className = "text-danger fw-bold";
            
            // Animasi salah
            const input = document.getElementById('audio-answer');
            input.classList.add('shake');
            setTimeout(() => {
                input.classList.remove('shake');
            }, 500);
        }
    },
    
    nextQuestion: function() {
        this.currentQuestion = (this.currentQuestion + 1) % this.questions.length;
        document.getElementById('audio-answer').value = '';
        document.getElementById('audio-feedback').textContent = '';
        document.getElementById('play-audio-btn').disabled = false;
        
        // Preload audio untuk pertanyaan berikutnya
        this.audioElement.src = this.questions[this.currentQuestion].audioUrl;
        this.audioElement.load();
    }
};

// Inisialisasi game audio hewan
audioGame.init();