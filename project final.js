
        const initialStudents = [
            { id: "B01", name: "Abdirahman Mohamed", status: "None" },
            { id: "B02", name: "Mustafe Hassan", status: "None" },
            { id: "B03", name: "Ahmed Nur", status: "None" },
            { id: "B04", name: "Yussuf Ali", status: "None" },
            { id: "B05", name: "Liban Omar", status: "None" },
            { id: "B06", name: "Faysal Jaamac", status: "None" },
            { id: "B07", name: "Mubaarak Islow", status: "None" },
            { id: "B08", name: "Khalid Ibrahim", status: "None" },
            { id: "B09", name: "Zubair Abdullahi", status: "None" },
            { id: "B10", name: "Guled Warsame", status: "None" },
            { id: "G01", name: "Fardowsa Abdi", status: "None" },
            { id: "G02", name: "Hani Ismaaciil", status: "None" },
            { id: "G03", name: "Zamzam Gurey", status: "None" },
            { id: "G04", name: "Khadra Farah", status: "None" },
            { id: "G05", name: "Sahra Yusuf", status: "None" },
            { id: "G06", name: "Leyla Barre", status: "None" },
            { id: "G07", name: "Nimco Salad", status: "None" },
            { id: "G08", name: "Ayan Hussein", status: "None" },
            { id: "G09", name: "Maryan Geedi", status: "None" },
            { id: "G10", name: "Saciido Qalinle", status: "None" }
        ];

        /**
         * 2. STATE MANAGEMENT
         * LocalStorage has been removed. Data resets on refresh.
         */
        let students = [...initialStudents];

        // DOM elements cache
        const loginPage = document.getElementById('login-page');
        const dashboard = document.getElementById('dashboard');
        const studentList = document.getElementById('student-list');
        const finalBtn = document.getElementById('final-submit-btn');
        const submitMsg = document.getElementById('submit-msg');
        const navTeacherName = document.getElementById('nav-teacher-name');

        /**
         * 3. INITIALIZATION
         * Checks session storage for temporary login state.
         */
        function init() {
            document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            });
            
            if (sessionStorage.getItem('teacherSession')) {
                navTeacherName.innerText = sessionStorage.getItem('teacherSession');
                showDashboard();
            }
        }

        function showDashboard() {
            loginPage.classList.add('hidden');
            dashboard.classList.remove('hidden');
            render();
        }

        /**
         * 4. DATA RENDERING
         * Rebuilds the student list table based on current status.
         */
        function render() {
            studentList.innerHTML = '';
            students.forEach((s, i) => {
                const tr = document.createElement('tr');
                let badge = '';
                
                if(s.status === 'Present') badge = '<span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold">PRESENT</span>';
                else if(s.status === 'Absent') badge = '<span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold">ABSENT</span>';
                else badge = '<span class="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold">UNMARKED</span>';

                tr.innerHTML = `
                    <td class="px-6 py-4 text-sm font-mono text-gray-400">${s.id}</td>
                    <td class="px-6 py-4 font-semibold text-gray-700">${s.name}</td>
                    <td class="px-6 py-4 text-center">${badge}</td>
                    <td class="px-6 py-4 text-right">
                        <div class="inline-flex space-x-2">
                            <button onclick="setStatus(${i}, 'Present')" class="w-10 h-10 flex items-center justify-center rounded-xl border-2 transition-all ${s.status === 'Present' ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'border-gray-100 text-gray-300 hover:border-green-400 hover:text-green-500'}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                            </button>
                            <button onclick="setStatus(${i}, 'Absent')" class="w-10 h-10 flex items-center justify-center rounded-xl border-2 transition-all ${s.status === 'Absent' ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'border-gray-100 text-gray-300 hover:border-red-400 hover:text-red-500'}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                            </button>
                        </div>
                    </td>
                `;
                studentList.appendChild(tr);
            });
            updateStats();
        }

        /**
         * 5. SET STATUS
         * Updates student status in the array.
         */
        function setStatus(i, status) {
            students[i].status = status;
            render();
        }

        /**
         * 6. UPDATE SUMMARY
         * Calculates totals and controls the state of the save button.
         */
        function updateStats() {
            const total = students.length;
            const present = students.filter(s => s.status === 'Present').length;
            const absent = students.filter(s => s.status === 'Absent').length;
            const remaining = students.filter(s => s.status === 'None').length;

            document.getElementById('stat-total').innerText = total;
            document.getElementById('stat-present').innerText = present;
            document.getElementById('stat-absent').innerText = absent;

            // Submit logic: Require all students to be marked
            if (remaining === 0) {
                finalBtn.disabled = false;
                finalBtn.classList.remove('opacity-20', 'cursor-not-allowed');
                submitMsg.innerHTML = '<span class="text-green-600 font-bold">All marked. Ready to save!</span>';
            } else {
                finalBtn.disabled = true;
                finalBtn.classList.add('opacity-20', 'cursor-not-allowed');
                submitMsg.innerText = `${remaining} students unmarked. Marking required before saving.`;
            }
        }

        /**
         * 7. EVENT LISTENERS
         */

        // Login validation
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('teacher-name').value;
            const pass = document.getElementById('password').value;

            if(pass.length >= 8) {
                sessionStorage.setItem('teacherSession', name);
                navTeacherName.innerText = name;
                showDashboard();
            } else {
                document.getElementById('login-error').classList.remove('hidden');
            }
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            sessionStorage.removeItem('teacherSession');
            location.reload();
        });

        // Bulk Actions
        document.getElementById('mark-all-present').addEventListener('click', () => {
            students.forEach(s => s.status = 'Present');
            render();
        });

        document.getElementById('reset-attendance').addEventListener('click', () => {
            students.forEach(s => s.status = 'None');
            render();
        });

        // Success Modal
        finalBtn.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = "fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4";
            overlay.innerHTML = `
                <div class="bg-white p-10 rounded-3xl text-center max-w-sm shadow-2xl scale-in">
                    <div class="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h4 class="text-xl font-bold text-gray-800">Attendance Saved!</h4>
                    <p class="text-gray-500 mt-2 mb-6 text-sm">Records for today have been processed successfully.</p>
                    <button onclick="this.parentElement.parentElement.remove()" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Close</button>
                </div>
            `;
            document.body.appendChild(overlay);
        });

        init();
    
