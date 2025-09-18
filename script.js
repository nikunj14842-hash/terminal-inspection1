const master = [
  {range:[2,8], code:'A', n:2, aql:{'0.65':[0,1],'2.5':[0,1],'4.0':[0,1]}},
  {range:[9,15], code:'B', n:3, aql:{'0.65':[0,1],'2.5':[0,1],'4.0':[0,1]}},
  {range:[16,25], code:'C', n:5, aql:{'0.65':[0,1],'2.5':[0,1],'4.0':[0,1]}},
  {range:[26,50], code:'D', n:8, aql:{'0.65':[0,1],'2.5':[0,1],'4.0':[1,2]}},
  {range:[51,90], code:'E', n:13, aql:{'0.65':[0,1],'2.5':[1,2],'4.0':[1,2]}},
  {range:[91,150], code:'F', n:20, aql:{'0.65':[0,1],'2.5':[1,2],'4.0':[2,3]}},
  {range:[151,280], code:'G', n:32, aql:{'0.65':[0,1],'2.5':[2,3],'4.0':[3,4]}},
  {range:[281,500], code:'H', n:50, aql:{'0.65':[1,2],'2.5':[3,4],'4.0':[5,6]}},
  {range:[501,1200], code:'J', n:80, aql:{'0.65':[2,3],'2.5':[5,6],'4.0':[7,8]}},
  {range:[1201,3200], code:'K', n:125, aql:{'0.65':[3,4],'2.5':[7,8],'4.0':[10,11]}}
];

let currentRules = {};

function findCode(lot, lvl){
  let mult = lvl==='I'?1: lvl==='II'?1.5:2;
  for(const r of master){
    if(lot >= r.range[0] && lot <= r.range[1]) return r.code;
  }
  return master[master.length-1].code;
}

function calculate(){
  const boxes = +document.getElementById('boxes').value;
  const perBox = +document.getElementById('perBox').value;
  const lvl = document.getElementById('inspLevel').value;
  const lot = boxes * perBox;

  const code = findCode(lot, lvl);
  const row = master.find(r => r.code === code);
  const n = row ? row.n : lot;
  const perBoxSample = Math.min(perBox, Math.ceil(n/boxes));

  const crit = row.aql['0.65'];
  const maj = row.aql['2.5'];
  const min = row.aql['4.0'];

  currentRules = {
    critical: {ac: crit[0], re: crit[1]},
    major: {ac: maj[0], re: maj[1]},
    minor: {ac: min[0], re: min[1]}
  };

  document.getElementById('output').style.display='block';
  document.getElementById('summary').innerHTML =
    `📦 Lot Size: <b>${lot}</b> → Code: <b>${code}</b> → Sample <b>${n}</b> items`;

  document.getElementById('details').innerHTML = `
    🔢 <b>Boxes:</b> ${boxes} × ${perBox} units<br>
    🏷️ <b>Inspection Level:</b> ${lvl}<br><br>
    📌 About <b>${perBoxSample}</b> samples per box (≈${n} total)<br><br>
    <table>
      <tr><th>Type</th><th>AQL</th><th>Ac</th><th>Re</th></tr>
      <tr><td>Critical</td><td>0.65%</td><td>${crit[0]}</td><td>${crit[1]}</td></tr>
      <tr><td>Major</td><td>2.5%</td><td>${maj[0]}</td><td>${maj[1]}</td></tr>
      <tr><td>Minor</td><td>4.0%</td><td>${min[0]}</td><td>${min[1]}</td></tr>
    </table>
  `;

  document.getElementById('defectEntry').style.display='block';
}

function checkDefects(){
  const crit = +document.getElementById('critDef').value;
  const maj = +document.getElementById('majDef').value;
  const min = +document.getElementById('minDef').value;

  let msg = "";

  if (crit > currentRules.critical.ac) 
    msg += `❌ Critical defects exceed (Ac=${currentRules.critical.ac})<br>`;
  if (maj > currentRules.major.ac) 
    msg += `❌ Major defects exceed (Ac=${currentRules.major.ac})<br>`;
  if (min > currentRules.minor.ac) 
    msg += `❌ Minor defects exceed (Ac=${currentRules.minor.ac})<br>`;

  if (!msg) msg = "✅ Lot ACCEPTED (within defect limits)";
  else msg += "<br>👉 Lot REJECTED";

  document.getElementById('defectResult').innerHTML = msg;
}
