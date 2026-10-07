const SUPABASE_URL = "https://vdbvigbkuzryfppjrynf.supabase.co/rest/v1";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_RRbbO4ggSrEMOYnl8RWTFw_ElCp3uI6";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const QUESTIONS = [
 {topic:'SISTEM NOMBOR',q:'Sistem nombor ______ mempunyai enam belas pilihan digit bermula daripada 0 hingga 9 dan A hingga F.',o:['A. oktal','B. binari','C. desimal','D. heksadesimal'],a:3},
 {topic:'NUMBER CONVERSION',q:'Tukarkan nombor perpuluhan 567₁₀ kepada nombor perenambelasan.',o:['A. 357₁₆','B. 456₁₆','C. 237₁₆','D. 23A₁₆'],a:2},
 {topic:'NILAI TEMPAT',q:'Jadual 1 di bawah merupakan nilai tempat sistem nombor perenambelasan. Cari nilai y.',o:['A. 32','B. 256','C. 512','D. 4096'],a:1},
 {topic:'HEXADECIMAL → DECIMAL',q:'Tukarkan nombor perenambelasan 7B56A₁₆ kepada nombor perpuluhan.',o:['A. 505194₁₀','B. 505195₁₀','C. 505244₁₀','D. 505245₁₀'],a:0},
 {topic:'SISTEM NOMBOR & KOMPUTER',q:'Berikut merupakan kenyataan yang benar mengenai sistem penomboran yang digunakan oleh sistem komputer, KECUALI',o:['A. Komputer hanya mengenali dua digit sahaja iaitu 1 dan 0 yang mana dikenali sebagai bahasa mesin.','B. Nombor perenambelasan digunakan untuk mewakili nombor perduaan supaya menjadi lebih pendek dan mudah dibaca.','C. Kod ASCII digunakan untuk membolehkan manusia berinteraksi dengan sebuah komputer.','D. Nombor perlapanan adalah penting untuk mewakili warna pada alatan digital dalam model warna RGB.'],a:3},
 {topic:'RALAT ATUR CARA',q:'Ralat ______ sukar untuk dikesan dalam atur cara kerana tiada paparan mesej ralat dikeluarkan selepas atur cara dilarikan.',o:['A. logik','B. sintaks','C. masa larian','D. semakan meja'],a:0},
 {topic:'STRUKTUR KAWALAN ULANGAN',q:'Struktur kawalan ulangan ______ akan melaksanakan ulangan selagi syarat yang diuji adalah benar.',o:['A. for','B. While','C. tunggal','D. dwipilihan'],a:1},
 {topic:'STRUKTUR KAWALAN',q:'Struktur kawalan yang melaksanakan arahan baris demi baris mengikut susunan satu aliran sahaja dikenali sebagai',o:['A. struktur kawalan pilihan','B. struktur kawalan jujukan','C. struktur kawalan ulangan','D. struktur kawalan pilihan bersarang'],a:1},
 {topic:'FUNGSI PYTHON',q:'Seorang atur cara ingin memaparkan output “MERDEKA!” sebanyak lima kali. Berdasarkan situasi ini, fungsi apakah yang paling sesuai untuk digunakan?',o:['A. len()','B. join()','C. print()','D. range()'],a:2},
 {topic:'DEBUGGING',q:'__________ ialah proses mencari dan menghapuskan ralat dalam atur cara.',o:['A. Lelaran','B. Pentafsir','C. Penyahpepijat','D. Penyahimpun'],a:2}
];

const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
let state={name:'',index:0,xp:0,coins:0,energy:6,correct:0,start:0};
let music={ctx:null,gain:null,timer:null,on:false};
const screens={main:$('#screen-main'),name:$('#screen-name'),instructions:$('#screen-instructions'),game:$('#screen-game'),leaderboard:$('#screen-leaderboard'),ending:$('#screen-ending')};
function show(key){Object.values(screens).forEach(x=>x.classList.remove('active'));screens[key].classList.add('active'); if(key==='leaderboard')renderLeaderboard(); if(key==='main')renderMainLeaderboard();}
function leaderboard(){return JSON.parse(localStorage.getItem('misiAskLeaderboard')||'[]')}
function saveScore(){const list=leaderboard();list.push({name:state.name,xp:state.xp,correct:state.correct,time:elapsed()});list.sort((a,b)=>b.xp-a.xp||a.time-b.time);async function saveScore(score) {

    const { data, error } = await supabaseClient
        .from("leaderboard")
        .insert({
            player_name: score.playerName,
            xp: score.xp,
            coins: score.coins,
            correct_answers: score.correctAnswers,
            total_questions: 10,
            completion_time: score.completionTime
        })
        .select();

    if (error) {
        console.error("Gagal simpan score:", error);
        return false;
    }

    console.log("Score berjaya disimpan:", data);
    return true;
}}
function renderMainLeaderboard(){const box=$('#mainLeaderboard');const list=leaderboard().slice(0,3);box.innerHTML=list.length?list.map((x,i)=>`<div class="mini-row"><span>${i+1}. ${escapeHtml(x.name)}</span><b>${x.xp} XP</b></div>`).join(''):'<p>Belum ada pemain.</p>'}
function renderLeaderboard(){const rows=$('#leaderboardRows');const list=leaderboard();rows.innerHTML=list.length?list.map((x,i)=>`<div class="lb-row ${x.name===state.name?'you':''}"><span>${i+1}</span><span>${escapeHtml(x.name)}</span><span>${x.xp}</span><span>${fmt(x.time)}</span></div>`).join(''):'<div class="lb-row"><span>—</span><span>Belum ada data</span><span>—</span><span>—</span></div>'}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function begin(){const n=$('#playerName').value.trim();if(!n){toast('Sila masukkan nama dahulu.');return}state={name:n,index:0,xp:0,coins:0,energy:6,correct:0,start:Date.now()};show('game');buildTrack();updateHud();setTimeout(()=>showQuestion(),450);startMusic()}
function buildTrack(){const t=$('#checkpointTrack');t.innerHTML=QUESTIONS.map((_,i)=>`<span class="cp-dot ${i===0?'current':''}" id="cp-${i}"></span>`).join('')}
function updateHud(){$('#xp').textContent=state.xp;$('#coins').textContent=state.coins;$('#cpCount').textContent=`${state.index} / 10`;$('#energy').textContent='█'.repeat(Math.max(0,state.energy))+'░'.repeat(6-Math.max(0,state.energy));for(let i=0;i<10;i++){const d=$(`#cp-${i}`);if(d)d.className='cp-dot '+(i<state.index?'done':i===state.index?'current':'')}}
function showQuestion(){const q=QUESTIONS[state.index];$('#questionCard').classList.remove('hidden');$('#qNumber').textContent=`CHECKPOINT ${state.index+1}`;$('#qTopic').textContent=q.topic;$('#questionText').textContent=q.q;$('#feedback').classList.add('hidden');$('#nextBtn').classList.add('hidden');$('#statusText').textContent='Pilih satu jawapan.';$('#options').innerHTML=q.o.map((x,i)=>`<button class="option" data-i="${i}">${x}</button>`).join('');$$('.option').forEach(b=>b.addEventListener('click',()=>answer(+b.dataset.i)));}
function answer(i){const q=QUESTIONS[state.index];$$('.option').forEach(b=>b.classList.add('disabled'));if(i===q.a){state.xp+=100;state.coins+=10;state.correct++;updateHud();$$('.option')[i].classList.add('correct');openModal('correct','✨','JAWAPAN BETUL!','Hebat! Checkpoint dibuka. Anda mendapat +100 XP dan +10 coins.','',()=>{closeModal();$('#questionCard').classList.add('hidden');state.index++;if(state.index>=QUESTIONS.length)finish();else{updateHud();setTimeout(showQuestion,350)}})}else{state.energy=Math.max(0,state.energy-1);updateHud();$$('.option')[i].classList.add('wrong');const correct=q.o[q.a];openModal('wrong','❌','JAWAPAN SALAH','Jangan risau. Semak jawapan yang betul di bawah untuk ulang kaji.','Jawapan betul: '+correct,()=>{closeModal();$$('.option').forEach(b=>b.classList.remove('disabled'));$('#statusText').textContent='Cuba lagi dengan jawapan yang betul.'});if(state.energy===0){state.energy=6;toast('Energy habis — dipulihkan supaya anda boleh terus belajar.')}}}
function finish(){saveScore();$('#endCp').textContent='10 / 10';$('#endXp').textContent=state.xp;$('#endCoins').textContent=state.coins;$('#endCorrect').textContent=`${state.correct} / 10`;$('#endTime').textContent=fmt(elapsed());show('ending');stopMusic()}
function elapsed(){return Math.floor((Date.now()-state.start)/1000)}function fmt(sec){const m=String(Math.floor(sec/60)).padStart(2,'0');const s=String(sec%60).padStart(2,'0');return `${m}:${s}`}
function openModal(type,icon,title,msg,answer,done){$('#modal').classList.remove('hidden');$('#modalIcon').textContent=icon;$('#modalTitle').textContent=title;$('#modalMessage').textContent=msg;$('#modalAnswer').textContent=answer;$('#modalAnswer').classList.toggle('hidden',!answer);const btn=$('#modalBtn');btn.textContent=type==='correct'?'TERUSKAN':'FAHAM, CUBA LAGI';btn.onclick=done}
function closeModal(){$('#modal').classList.add('hidden')}
function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2200)}
function replay(){show('name');$('#playerName').value='';}
$$('[data-action]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.action;if(a==='start')show('name');if(a==='begin')begin();if(a==='instructions')show('instructions');if(a==='leaderboard')show('leaderboard');if(a==='back-main'){stopMusic();show('main');renderMainLeaderboard()}if(a==='replay')replay();if(a==='clear-leaderboard'){if(confirm('Padam semua rekod leaderboard pada browser ini?')){localStorage.removeItem('misiAskLeaderboard');renderLeaderboard();renderMainLeaderboard()}}}));
$('#playerName').addEventListener('keydown',e=>{if(e.key==='Enter')begin()});
function startMusic(){if(music.on)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;music.ctx=new C();music.gain=music.ctx.createGain();music.gain.gain.value=.035;music.gain.connect(music.ctx.destination);music.on=true;const notes=[261.63,293.66,329.63,392,440,392,329.63,293.66];let n=0;const play=()=>{if(!music.on)return;const o=music.ctx.createOscillator();const g=music.ctx.createGain();o.type='sine';o.frequency.value=notes[n++%notes.length];g.gain.setValueAtTime(0,music.ctx.currentTime);g.gain.linearRampToValueAtTime(.35,music.ctx.currentTime+.04);g.gain.exponentialRampToValueAtTime(.001,music.ctx.currentTime+1.4);o.connect(g);g.connect(music.gain);o.start();o.stop(music.ctx.currentTime+1.5);music.timer=setTimeout(play,1700)};play();$('#musicToggle').textContent='🔊'}
function stopMusic(){if(music.timer)clearTimeout(music.timer);if(music.ctx){music.ctx.close();music.ctx=null}music.on=false;$('#musicToggle').textContent='🔇'}
$('#musicToggle').addEventListener('click',()=>music.on?stopMusic():startMusic());
renderMainLeaderboard();
