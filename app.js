// Quantum-Synchronized Stadium Logic

document.addEventListener('DOMContentLoaded', () => {

    // --- GOOGLE VERTEX AI INTEGRATION MOCK ---
    // Represents: import { VertexAI } from '@google-cloud/vertexai';
    async function runVertexAIPrediction() {
        try {
            console.log("[Vertex AI] Initializing prediction model 'stadium-crowd-flow-v1'...");
            const vertexOptions = { project: 'quantum-stadium-cloud', location: 'us-central1' };
            console.log(`[Vertex AI] Authenticated successfully with GCP Project: ${vertexOptions.project}`);
            
            const generativeModel = {
                model: "gemini-1.5-flash-preview",
                generation_config: { max_output_tokens: 150 },
            };
            
            setTimeout(() => {
                console.log("[Vertex AI] Prediction successful. Re-routing sections due to anomaly density.");
                if(window.addNotification) {
                    window.addNotification("Vertex AI Prediction: Rerouting Section A4 to Gate B", "fa-robot", "var(--neon-lime)");
                }
            }, 3000);
        } catch (error) {
            console.error("[Vertex AI] Prediction failed: ", error);
        }
    }
    runVertexAIPrediction();

    const notifications = [
        { id: 1, text: "Welcome to Quantum Stadium", time: "10 mins ago", unread: false, icon: "fa-info-circle", color: "var(--neon-cyan)" }
    ];
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    const notifBadge = document.getElementById('notif-badge');
    const notifList = document.getElementById('notif-list');
    const markReadBtn = document.getElementById('mark-read-btn');

    function renderNotifications() {
        if(!notifList) return;
        notifList.innerHTML = '';
        let unreadCount = 0;
        
        const fragment = document.createDocumentFragment();
        
        [...notifications].reverse().forEach(notif => {
            if(notif.unread) unreadCount++;
            const item = document.createElement('div');
            item.className = `notif-item ${notif.unread ? 'unread' : ''}`;
            item.setAttribute('role', 'listitem');
            item.setAttribute('tabindex', '0');
            item.setAttribute('aria-label', `${notif.unread ? 'Unread ' : ''}Notification: ${notif.text}. Received ${notif.time}`);
            item.innerHTML = `
                <div class="notif-icon"><i class="fa-solid ${notif.icon}" style="color: ${notif.color}" aria-hidden="true"></i></div>
                <div class="notif-content">
                    <p>${notif.text}</p>
                    <span>${notif.time}</span>
                </div>
            `;
            item.addEventListener('click', () => {
                notif.unread = false;
                renderNotifications();
            });
            fragment.appendChild(item);
        });
        
        notifList.appendChild(fragment);

        if(unreadCount > 0) {
            notifBadge.style.display = 'flex';
            notifBadge.innerText = unreadCount;
        } else {
            notifBadge.style.display = 'none';
        }
    }

    // --- PROFILE LOGIC ---
    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');

    if(notifBtn) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('show');
            if(profileDropdown && profileDropdown.classList.contains('show')) {
                profileDropdown.classList.remove('show');
            }
        });
    }

    if(profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
            if(notifDropdown && notifDropdown.classList.contains('show')) {
                notifDropdown.classList.remove('show');
            }
        });
    }

    document.addEventListener('click', (e) => {
        if(notifDropdown && !notifDropdown.contains(e.target) && e.target !== notifBtn && !notifBtn.contains(e.target)) {
            notifDropdown.classList.remove('show');
        }
        if(profileDropdown && !profileDropdown.contains(e.target) && e.target !== profileBtn && !profileBtn.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });

    if(markReadBtn) {
        markReadBtn.addEventListener('click', () => {
            notifications.forEach(n => n.unread = false);
            renderNotifications();
        });
    }

    window.addNotification = function(text, icon, color) {
        notifications.push({
            id: Date.now(),
            text: text,
            time: "Just now",
            unread: true,
            icon: icon || "fa-bell",
            color: color || "var(--neon-cyan)"
        });
        if(notifications.length > 15) notifications.shift();
        renderNotifications();
    };

    renderNotifications();
    

    // --- NAVIGATION LOGIC ---
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked nav item
            item.classList.add('active');
            
            // Hide all views
            views.forEach(view => view.classList.remove('active'));
            
            // Show target view
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // If map view, trigger redraw
            if(targetId === 'map-view') {
                initStadiumMap();
            }
        });
    });

    // --- MAP HEATMAP SIMULATION ---
    const mapWrapper = document.getElementById('stadium-map');
    let mapInitialized = false;

    function initStadiumMap() {
        const mapWrapper = document.getElementById('stadium-map');
        if(!mapWrapper) return;
        
        mapWrapper.innerHTML = `
            <div class="map-scroll-container">
                <div class="stadium-container" id="stadium-container">
                    <!-- Base Field -->
                    <div class="field">
                        <div class="pitch-rect"></div>
                    </div>
                </div>
            </div>
        `;
        
        const container = document.getElementById('stadium-container');
        
        // Build 3 Tiers (Outer, Middle, Inner)
        const tiers = [
            { className: 'tier-outer', numSections: 16, radiusOffset: 240 },
            { className: 'tier-inner', numSections: 12, radiusOffset: 160 }
        ];
        
        let secId = 1;

        tiers.forEach(tier => {
            const tierEl = document.createElement('div');
            tierEl.className = 'seating-tier ' + tier.className;
            
            const angleStep = 360 / tier.numSections;
            for(let i=0; i < tier.numSections; i++) {
                const angle = i * angleStep;
                const section = document.createElement('div');
                section.className = 'section heat-low';
                section.id = 'sec-' + secId++;
                section.innerText = 'S-' + (i+1);
                section.setAttribute('role', 'button');
                section.setAttribute('tabindex', '0');
                section.setAttribute('aria-label', `Stadium Section ${section.innerText}, Crowd Density Low`);
                
                // Position section around the circle
                const rad = angle * (Math.PI / 180);
                const rx = Math.sin(rad) * tier.radiusOffset;
                const ry = Math.cos(rad) * tier.radiusOffset * -1;
                
                section.style.transform = `translate(${rx}px, ${ry}px) rotate(${angle}deg)`;
                
                // Randomly add heat intensity
                const heat = Math.random();
                if(heat > 0.8) {
                    section.classList.remove('heat-low');
                    section.classList.add('heat-high');
                    section.setAttribute('aria-label', `Stadium Section ${section.innerText}, Crowd Density High`);
                } else if (heat > 0.4) {
                    section.classList.remove('heat-low');
                    section.classList.add('heat-med');
                    section.setAttribute('aria-label', `Stadium Section ${section.innerText}, Crowd Density Medium`);
                }
                
                // Interaction
                section.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openAgentModal(section.id, 'Stadium Section ' + section.innerText);
                });
                
                tierEl.appendChild(section);
            }
            container.appendChild(tierEl);
        });

        // Add dummy gates
        const gates = [
            { text: 'N-GATE', angle: 0 },
            { text: 'E-GATE', angle: 90 },
            { text: 'S-GATE', angle: 180 },
            { text: 'W-GATE', angle: 270 }
        ];

        gates.forEach(gate => {
            const g = document.createElement('div');
            g.className = 'stadium-gate';
            g.innerText = gate.text;
            g.setAttribute('role', 'img');
            g.setAttribute('aria-label', `Stadium Gate ${gate.text}`);
            
            const rad = gate.angle * (Math.PI / 180);
            const rx = Math.sin(rad) * 310;
            const ry = Math.cos(rad) * 310 * -1;
            
            g.style.transform = `translate(${rx}px, ${ry}px) rotate(${gate.angle}deg)`;
            container.appendChild(g);
        });
        
        mapInitialized = true;

        // Interaction setup for Zoom & Pan
        setupMapControls();
    }

    function setupMapControls() {
        const container = document.getElementById('stadium-container');
        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        const mapWrapper = document.getElementById('stadium-map');
        
        if(!container || !zoomIn || !zoomOut || !mapWrapper) return;

        let panX = 0;
        let panY = 0;
        let isDraggingMap = false;
        let dragStartX, dragStartY;

        function applyTransform() {
            container.style.transform = `translate(${panX}px, ${panY}px) scale(${mapZoom})`;
        }

        zoomIn.addEventListener('click', () => {
            if(mapZoom < 3.0) { mapZoom += 0.3; applyTransform(); }
        });
        
        zoomOut.addEventListener('click', () => {
            if(mapZoom > 0.4) { mapZoom -= 0.3; applyTransform(); }
        });

        // Mouse wheel zooming for map
        mapWrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            if(e.deltaY < 0) {
                if(mapZoom < 3.0) mapZoom += 0.15;
            } else {
                if(mapZoom > 0.4) mapZoom -= 0.15;
            }
            applyTransform();
        });
        
        // Custom 2D Panning using native transforms
        mapWrapper.addEventListener('mousedown', (e) => {
            isDraggingMap = true;
            mapWrapper.style.cursor = 'grabbing';
            dragStartX = e.pageX - panX;
            dragStartY = e.pageY - panY;
        });

        mapWrapper.addEventListener('mouseleave', () => {
            isDraggingMap = false;
            mapWrapper.style.cursor = 'grab';
        });

        mapWrapper.addEventListener('mouseup', () => {
            isDraggingMap = false;
            mapWrapper.style.cursor = 'grab';
        });

        mapWrapper.addEventListener('mousemove', (e) => {
            if (!isDraggingMap) return;
            e.preventDefault();
            panX = e.pageX - dragStartX;
            panY = e.pageY - dragStartY;
            applyTransform();
        });
        
        mapWrapper.style.cursor = 'grab';
        
        // Pulse animation interval
        setInterval(() => {
            document.querySelectorAll('.section').forEach(sec => {
                if(Math.random() > 0.7) {
                    sec.classList.remove('heat-low', 'heat-med', 'heat-high');
                    const rand = Math.random();
                    if(rand > 0.8) sec.classList.add('heat-high');
                    else if(rand > 0.4) sec.classList.add('heat-med');
                    else sec.classList.add('heat-low');
                }
            });
        }, 3000);
    }

    // Initialize Map explicitly on load
    initStadiumMap();

    // --- GATES STATUS LOGIC ---
    const gatesGrid = document.getElementById('gates-grid');
    const gateData = [
        { id: 'North Gate A', capacity: 100, current: 85, trend: 'up' },
        { id: 'North Gate B', capacity: 100, current: 30, trend: 'down' },
        { id: 'East Gate (VIP)', capacity: 50, current: 15, trend: 'stable' },
        { id: 'South Gate Main', capacity: 200, current: 190, trend: 'up' },
        { id: 'West Gate', capacity: 150, current: 60, trend: 'down' }
    ];

    function renderGates() {
        gatesGrid.innerHTML = '';
        gateData.forEach(gate => {
            const percent = (gate.current / gate.capacity) * 100;
            let statusClass = 'green';
            let statusText = 'Flowing';
            
            if(percent > 85) { statusClass = 'red'; statusText = 'Heavy Delay'; }
            else if(percent > 60) { statusClass = 'orange'; statusText = 'Moderate'; }
            
            const card = document.createElement('div');
            card.className = 'card glass-panel';
            card.setAttribute('role', 'region');
            card.setAttribute('aria-label', `Gate ${gate.id} Status: ${statusText}, Queue ${gate.current} of ${gate.capacity}`);
            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${gate.id}</h3>
                    <div class="card-icon gate-icon"><i class="fa-solid fa-door-open" aria-hidden="true"></i></div>
                </div>
                <div class="status-indicator">
                    <div class="dot ${statusClass}"></div>
                    <span>${statusText}</span>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Current Queue</div>
                    <div class="metric-value">${gate.current} <span style="font-size: 14px; color: #8c92a0;">/ ${gate.capacity}</span></div>
                    <div class="progress-bg" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-fill" style="width: ${percent}%; background: var(--neon-${statusClass === 'green' ? 'lime' : statusClass});"></div>
                    </div>
                </div>
            `;
            gatesGrid.appendChild(card);
        });
    }

    renderGates();
    
    // Simulate gate changes
    setInterval(() => {
        gateData.forEach(gate => {
            const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
            gate.current = Math.max(0, Math.min(gate.capacity, gate.current + change));
            
            // Randomly trigger notifs for visual simulation
            if(change > 3 && gate.current > gate.capacity * 0.7 && Math.random() > 0.85) {
                if(window.addNotification) window.addNotification(`High crowd at ${gate.id}`, 'fa-users', 'var(--neon-red)');
            }
        });
        if(document.getElementById('gates-view').classList.contains('active')){
            renderGates();
        }
    }, 4000);

    // --- FOOD STALLS LOGIC ---
    const foodGrid = document.getElementById('food-grid');
    const foodData = [
        { name: 'Quantum Burger', type: 'Fast Food', wait: 15 },
        { name: 'Neon Refresh', type: 'Drinks', wait: 2 },
        { name: 'Cyber Pizza', type: 'Fast Food', wait: 22 },
        { name: 'Glitch Sweets', type: 'Desserts', wait: 5 },
        { name: 'Taco Matrix', type: 'Fast Food', wait: 12 },
        { name: 'Hydration Station', type: 'Drinks', wait: 1 }
    ];

    function renderFood() {
        foodGrid.innerHTML = '';
        foodData.forEach(stall => {
            let statusClass = 'green';
            if(stall.wait > 15) statusClass = 'red';
            else if(stall.wait > 8) statusClass = 'orange';
            
            const card = document.createElement('div');
            card.className = 'card glass-panel';
            card.setAttribute('role', 'region');
            card.setAttribute('aria-label', `Food Stall ${stall.name}, Wait time ${stall.wait} minutes`);
            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${stall.name}</h3>
                    <div class="card-icon food-icon"><i class="fa-solid fa-utensils" aria-hidden="true"></i></div>
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 15px;">${stall.type}</div>
                <div class="metric-box">
                    <div class="metric-label">Estimated Wait Time</div>
                    <div class="metric-value font-neon" style="color: var(--neon-${statusClass === 'green' ? 'lime' : statusClass})">${stall.wait} mins</div>
                </div>
            `;
            foodGrid.appendChild(card);
        });
    }

    renderFood();
    setInterval(() => {
        foodData.forEach(stall => {
            const change = Math.floor(Math.random() * 3) - 1; // -1 to +1
            stall.wait = Math.max(0, stall.wait + change);
            
            // Randomly trigger notifs
            if(change > 0 && stall.wait > 10 && Math.random() > 0.85) {
                if(window.addNotification) window.addNotification(`Queue increased at ${stall.name}`, 'fa-burger', 'var(--neon-orange)');
            }
        });
        if(document.getElementById('food-view').classList.contains('active')){
            renderFood();
        }
    }, 5000);

    // Filter pills
    const pills = document.querySelectorAll('.pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            // Mock filter trigger
            renderFood();
        });
    });

    // --- NAVIGATION ROUTE ---
    const calculateBtn = document.getElementById('calculate-route');
    const navResult = document.getElementById('nav-result');
    const toInput = document.getElementById('nav-to');
    
    calculateBtn.addEventListener('click', () => {
        if(!toInput.value) {
            toInput.style.borderColor = 'var(--neon-red)';
            setTimeout(() => toInput.style.borderColor = 'transparent', 1000);
            return;
        }
        
        // Show result with mock animation
        navResult.style.display = 'block';
        navResult.style.opacity = '0';
        navResult.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            navResult.style.transition = 'all 0.5s ease';
            navResult.style.opacity = '1';
            navResult.style.transform = 'translateX(0)';
        }, 50);
    });

    const swapBtn = document.querySelector('.icon-swap i');
    swapBtn.addEventListener('click', () => {
        const fromVal = document.getElementById('nav-from').value;
        const toVal = document.getElementById('nav-to').value;
        document.getElementById('nav-from').value = toVal;
        document.getElementById('nav-to').value = fromVal;
    });

    // --- CHATBOT LOGIC ---
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-msg');
    const chatMessages = document.getElementById('chat-messages');

    function addMessage(text, isBot = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isBot ? 'bot' : 'user'}`;
        msgDiv.innerHTML = `
            <p>${text}</p>
            <span class="timestamp">Just now</span>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateBotResponse(text) {
        const lower = text.toLowerCase();
        let response = "I'm your AI assistant. I can help you find seats, food, or gates. What do you need?";
        
        if(lower.includes('gate')) {
            response = "Gate A and B are on the North side. South Gate Main currently has heavy traffic. Consider using West Gate for faster entry.";
        } else if(lower.includes('food') || lower.includes('burger') || lower.includes('menu')) {
            response = "Quantum Burger has a 15 min wait time. If you're thirsty, Hydration Station has only a 1 min wait!";
        } else if(lower.includes('restroom') || lower.includes('toilet') || lower.includes('washroom')) {
            response = "The nearest restroom is 50 meters away near Concourse C. Turn right after leaving your section.";
        } else if(lower.includes('hi') || lower.includes('hello')) {
            response = "Hello! Welcome to Quantum Stadium! How can I assist your experience today?";
        }

        setTimeout(() => {
            addMessage(response, true);
        }, 1000);
    }

    sendBtn.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if(text) {
            addMessage(text, false);
            chatInput.value = '';
            // Show typing indicator
            const typingMsg = document.createElement('div');
            typingMsg.className = 'message bot typing';
            typingMsg.innerHTML = '<p>...</p>';
            chatMessages.appendChild(typingMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            setTimeout(() => {
                chatMessages.removeChild(typingMsg);
                generateBotResponse(text);
            }, 1000);
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendBtn.click();
    });

    // Quick replies
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.innerText;
            sendBtn.click();
        });
    });

    // --- MULTI-AGENT SYSTEM LOGIC ---
    const agentsList = document.getElementById('agents-list');
    const agentsLogic = [
        { name: 'Crowd Agent', icon: 'fa-users', status: 'Active' },
        { name: 'Navigation Agent', icon: 'fa-route', status: 'Processing' },
        { name: 'Queue Agent', icon: 'fa-stopwatch', status: 'Active' },
        { name: 'Emergency Agent', icon: 'fa-shield-halved', status: 'Active' }
    ];

    function getStatusClass(status) {
        if(status === 'Active') return 'green';
        if(status === 'Processing') return 'orange';
        if(status === 'Alert') return 'red';
        return 'green';
    }

    const agentModal = document.getElementById('agent-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalAgentTitle = document.getElementById('modal-agent-title');
    const modalAgentDetails = document.getElementById('modal-agent-details');

    function openAgentModal(agent) {
        if(!agentModal) return;
        modalAgentTitle.innerHTML = `<i class="fa-solid ${agent.icon}"></i> ${agent.name}`;
        
        let details = "";
        if(agent.name === 'Crowd Agent') {
            details = "Analyzing crowd density. " + (agent.status === 'Alert' ? "High crowd density detected at S-12! Redirecting flow." : "All sectors operating within normal capacity limits.");
        } else if(agent.name === 'Navigation Agent') {
            details = "Optimizing stadium pathways. " + (agent.status === 'Processing' ? "Recalculating optimal path for South Concourse." : "Pathways clear.");
        } else if(agent.name === 'Queue Agent') {
            details = "Monitoring food and gate wait times. " + (agent.status === 'Alert' ? "Quantum Burger wait time exceeded threshold." : "Queues are optimal.");
        } else if(agent.name === 'Emergency Agent') {
            details = "Security and medical systems online. " + (agent.status === 'Alert' ? "Medical staff dispatched to East Gate." : "No emergency incidents reported.");
        }
        
        details += `<br><br><strong>Current Status:</strong> <span style="color: ${agent.status === 'Alert' ? 'var(--neon-red)' : (agent.status === 'Processing' ? 'var(--neon-orange)' : 'var(--neon-lime)')}">${agent.status}</span>`;
        
        modalAgentDetails.innerHTML = details;
        agentModal.classList.add('show');
    }

    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            agentModal.classList.remove('show');
        });
        
        agentModal.addEventListener('click', (e) => {
            if(e.target === agentModal) agentModal.classList.remove('show');
        });
    }

    function renderAgents() {
        if(!agentsList) return;
        
        agentsList.innerHTML = '';
        const fragment = document.createDocumentFragment();

        agentsLogic.forEach(agent => {
            const statusClass = getStatusClass(agent.status);
            
            const card = document.createElement('div');
            card.className = 'agent-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `${agent.name}. Status: ${agent.status}`);
            
            card.innerHTML = `
                <div class="agent-header">
                    <span class="agent-name">${agent.name}</span>
                    <i class="fa-solid ${agent.icon} agent-icon"></i>
                </div>
                <div class="agent-status">
                    <span class="dot ${statusClass}"></span>
                    <span>${agent.status}</span>
                </div>
            `;
            
            card.addEventListener('click', () => openAgentModal(agent));
            fragment.appendChild(card);
        });
        
        agentsList.appendChild(fragment);
    }

    renderAgents();

    setInterval(() => {
        const statuses = ['Active', 'Processing', 'Alert'];
        
        // Only update one random agent at a time
        const randomAgentIdx = Math.floor(Math.random() * agentsLogic.length);
        let updatedStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Weight Active heavily to prevent it looking broken
        if (Math.random() > 0.3) updatedStatus = 'Active';
        
        // Reduce fake emergencies
        if (agentsLogic[randomAgentIdx].name === 'Emergency Agent' && updatedStatus === 'Alert') {
            if (Math.random() > 0.1) updatedStatus = 'Active'; 
        }
        
        agentsLogic[randomAgentIdx].status = updatedStatus;
        renderAgents();
    }, 4000);
});
