const { readInputFile, splitByLine, findLCM } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const modulesArr = file.map((line) => {
  const [left, right] = line.split(' -> ');
  const type = left[0];
  const name = type === 'b' ? left : left.slice(1);
  const outputs = right.split(', ');
  if (type === '%') return { type, name, outputs, on: false };
  if (type === '&') return { type, name, outputs, inputs: {} };
  return { type, name, outputs };
});

let modules = {};
for (const item of modulesArr) {
  const { name, ...rest } = item;
  modules[name] = rest;
}

const conjunctions = modulesArr.filter((m) => m.type === '&');
conjunctions.forEach((con) => {
  modulesArr.forEach((mod) => {
    if (mod.outputs.includes(con.name)) modules[con.name].inputs[mod.name] = 'lo';
  });
});

const modulesInitialState = JSON.stringify(modules);

const machineInput = modulesArr.find((m) => m.outputs.includes('rx')).name;
const machineSources = modulesArr.filter((m) => m.outputs.includes(machineInput)).map((x) => x.name);
let save = [[], [], [], []];

// button press
const runCycle = (circuitState, presses) => {
  const circuit = JSON.parse(circuitState);
  const pulseQueue = [];
  pulseQueue.push(['broadcaster', 'lo', '']);
  //go through circuit
  for (let i = 0; i < pulseQueue.length; i++) {
    const pulse = pulseQueue[i];
    const module = circuit[pulse[0]];
    if (module === undefined) continue;
    if (module.type === 'b') {
      module.outputs.forEach((out) => pulseQueue.push([out, pulse[1], pulse[0]]));
    } else if (module.type === '%') {
      if (pulse[1] === 'hi') continue; //ignore
      module.on = !module.on;
      if (module.on === false) {
        module.outputs.forEach((out) => pulseQueue.push([out, 'lo', pulse[0]]));
      } else {
        module.outputs.forEach((out) => pulseQueue.push([out, 'hi', pulse[0]]));
      }
      circuit[pulse[0]].on = module.on;
    } else if (module.type === '&') {
      module.inputs[pulse[2]] = pulse[1];
      if (Object.values(module.inputs).every((input) => input === 'hi')) {
        module.outputs.forEach((out) => pulseQueue.push([out, 'lo', pulse[0]]));
      } else {
        module.outputs.forEach((out) => pulseQueue.push([out, 'hi', pulse[0]]));
        if (machineSources.includes(pulse[0])) save[machineSources.indexOf(pulse[0])].push(presses);
      }
      circuit[pulse[0]].inputs[pulse[2]] = pulse[1];
    }
  }
  return JSON.stringify(circuit);
};

let tempCircuitState = modulesInitialState;
for (let n = 1; n <= 10000; n++) {
  const resState = runCycle(tempCircuitState, n);
  tempCircuitState = resState;
  if (save.every((x) => x.length > 0)) break;
}
console.log(findLCM(save.map((x) => x[0])));
