const players = [];
const savedData = [];
let editingPlayerIndex = null;
let selectedDataIndex = null;

// Oyuncu ekleme veya düzenleme fonksiyonu
function addOrUpdatePlayer() {
    const name = document.getElementById('name').value;
    const position = document.getElementById('position').value;
    const goalkeeperSkill = parseInt(document.getElementById('goalkeeperSkill').value);
    const defenderSkill = parseInt(document.getElementById('defenderSkill').value);
    const midfielderSkill = parseInt(document.getElementById('midfielderSkill').value);
    const forwardSkill = parseInt(document.getElementById('forwardSkill').value);

    // Giriş doğrulama
    if (!name) {
        alert("Lütfen oyuncu adını girin.");
        return;
    }
    if (!position) {
        alert("Lütfen standart mevki seçin.");
        return;
    }
    if (isNaN(goalkeeperSkill) || isNaN(defenderSkill) || isNaN(midfielderSkill) || isNaN(forwardSkill)) {
        alert("Lütfen tüm yetenek puanlarını doldurun.");
        return;
    }

    const player = {
        name,
        position,
        goalkeeperSkill,
        defenderSkill,
        midfielderSkill,
        forwardSkill
    };

    if (editingPlayerIndex !== null) {
        players[editingPlayerIndex] = player;
        editingPlayerIndex = null;
    } else {
        players.push(player);
    }

    clearForm();
    displayPlayers();
}

// Formu temizleme fonksiyonu
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('position').value = '';
    document.getElementById('goalkeeperSkill').value = '';
    document.getElementById('defenderSkill').value = '';
    document.getElementById('midfielderSkill').value = '';
    document.getElementById('forwardSkill').value = '';
}

// Oyuncu listesini ekranda göster
function displayPlayers() {
    const playersDiv = document.getElementById('players');
    playersDiv.innerHTML = '';
    players.forEach((player, index) => {
        playersDiv.innerHTML += `
            <div class="list-group-item player-card">
                ${index + 1}. ${player.name} (${player.position}) - Kalecilik: ${player.goalkeeperSkill}, Stoper: ${player.defenderSkill}, Orta Saha: ${player.midfielderSkill}, Forvet: ${player.forwardSkill}
                <button class="btn btn-sm btn-warning float-end ms-2" onclick="editPlayer(${index})">Düzenle</button>
                <button class="btn btn-sm btn-danger float-end" onclick="deletePlayer(${index})">Sil</button>
            </div>`;
    });
}

// Oyuncu düzenleme fonksiyonu
function editPlayer(index) {
    const player = players[index];
    document.getElementById('name').value = player.name;
    document.getElementById('position').value = player.position;
    document.getElementById('goalkeeperSkill').value = player.goalkeeperSkill;
    document.getElementById('defenderSkill').value = player.defenderSkill;
    document.getElementById('midfielderSkill').value = player.midfielderSkill;
    document.getElementById('forwardSkill').value = player.forwardSkill;
    editingPlayerIndex = index;
}

// Oyuncu silme fonksiyonu
function deletePlayer(index) {
    players.splice(index, 1);
    displayPlayers();
}

// Takımları oluşturma fonksiyonu
function createTeams() {
    const matchDate = document.getElementById('matchDate').value;
    if (!matchDate) {
        alert("Lütfen halı saha tarihi seçin.");
        return;
    }

    if (players.length < 14) {
        alert("En az 14 oyuncu girmelisiniz.");
        return;
    }

    if (players.length % 2 !== 0) {
        alert("Oyuncu sayısı tek olduğu için takımlar eşit şekilde oluşturulamaz.");
        return;
    }

    const teams = [[], []];

    // Savunmacı ve hücumcu oyuncuları ayır
    const defenders = players.filter(player => player.position === "goalkeeper" || player.position === "defender");
    const attackers = players.filter(player => player.position === "midfielder" || player.position === "forward");

    // Savunmacı oyuncuları dağıt
    distributePlayers(defenders, teams);

    // Hücumcu oyuncuları dağıt
    distributePlayers(attackers, teams);

    displayTeams(teams);

    // Veriyi kaydet
    saveData(matchDate, teams);
}

// Oyuncuları iki takıma eşit şekilde dağıt
function distributePlayers(players, teams) {
    players.forEach((player, index) => {
        teams[index % 2].push(player);
    });
}

// Takımları ekranda göster
function displayTeams(teams) {
    const teamsDiv = document.getElementById('teams');
    teamsDiv.innerHTML = '';
    teams.forEach((team, index) => {
        teamsDiv.innerHTML += `<div class="team-title">Takım ${index + 1}</div>`;
        team.forEach(player => {
            teamsDiv.innerHTML += `<p>${player.name} (${player.position}) - Kalecilik: ${player.goalkeeperSkill}, Stoper: ${player.defenderSkill}, Orta Saha: ${player.midfielderSkill}, Forvet: ${player.forwardSkill}</p>`;
        });
    });
}

// Veriyi kaydet
function saveData(matchDate, teams) {
    const data = {
        date: matchDate,
        timestamp: new Date().toLocaleString(),
        teams: JSON.parse(JSON.stringify(teams))
    };
    savedData.push(data);
    displaySavedData();
}

// Kaydedilen verileri ekranda göster
function displaySavedData() {
    const savedDataDiv = document.getElementById('savedData');
    savedDataDiv.innerHTML = '';
    savedData.forEach((data, index) => {
        const isSelected = index === selectedDataIndex ? 'selected-data' : '';
        savedDataDiv.innerHTML += `
            <div class="list-group-item ${isSelected}" onclick="loadSavedData(${index})" style="cursor: pointer;">
                <strong>Tarih:</strong> ${data.date} - <strong>Oluşturma:</strong> ${data.timestamp}
            </div>`;
    });
}

// Kaydedilen veriyi yükle
function loadSavedData(index) {
    selectedDataIndex = index;
    const data = savedData[index];
    players.length = 0;
    data.teams.flat().forEach(player => players.push(player));
    displayPlayers();
    displayTeams(data.teams);
    displaySavedData(); // Seçili kaydın arka planını güncelle
}