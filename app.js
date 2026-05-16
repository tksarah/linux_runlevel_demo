const runlevels = {
  0: {
    command: "init 0",
    label: "halt",
    title: "Runlevel 0",
    summary: "システムを停止します。ログイン画面には到達しません。",
    explanationTitle: "Runlevel 0: halt / システム停止",
    explanation:
      "init 0は停止処理です。サービスを止め、ファイルシステムを安全に処理し、最後に電源断できる状態へ向かいます。作業用のランレベルではありません。",
    services: [
      ["network", false],
      ["multi-user login", false],
      ["graphical display", false],
      ["power off", true],
    ],
    logs: [
      "# init 0",
      "init: Switching to runlevel: 0",
      "Stopping gdm: [  OK  ]",
      "Stopping network: [  OK  ]",
      "Stopping login services: [  OK  ]",
      "Unmounting local filesystems: [  OK  ]",
      "Power down.",
    ],
    visual: "halt",
  },
  1: {
    command: "init 1",
    label: "single-user",
    title: "Runlevel 1",
    summary: "管理者だけが入る保守モードです。ネットワークや複数ユーザー利用は基本的に使いません。",
    explanationTitle: "Runlevel 1: single-user / 保守モード",
    explanation:
      "init 1は単一ユーザーモードへ移行します。トラブル対応やパスワード復旧など、最小限のサービスだけで修理したい場面をイメージしてください。",
    services: [
      ["root maintenance shell", true],
      ["network", false],
      ["multi-user login", false],
      ["graphical display", false],
    ],
    logs: [
      "# init 1",
      "init: Switching to runlevel: 1",
      "Stopping display manager: [  OK  ]",
      "Stopping network: [  OK  ]",
      "Starting maintenance shell: [  OK  ]",
      "Give root password for maintenance",
      "(or press Control-D to continue):",
    ],
    visual: "single",
  },
  3: {
    command: "init 3",
    label: "multi-user text",
    title: "Runlevel 3",
    summary: "ネットワークありのCUIマルチユーザー環境として起動します。",
    explanationTitle: "Runlevel 3: multi-user text / CUIログイン",
    explanation:
      "init 3はGUIなしのマルチユーザー環境へ移行します。サーバ管理では、GUIを起動せず端末ログインで操作する状態としてよく説明されます。",
    services: [
      ["local login", true],
      ["network", true],
      ["ssh or remote login", true],
      ["graphical display", false],
    ],
    logs: [
      "# init 3",
      "init: Switching to runlevel: 3",
      "Stopping display manager: [  OK  ]",
      "Starting network: [  OK  ]",
      "Starting sshd: [  OK  ]",
      "Starting text login prompts: [  OK  ]",
      "AlmaLinux 9 localhost.localdomain tty1",
      "localhost login:",
    ],
    visual: "tty",
  },
  5: {
    command: "init 5",
    label: "graphical",
    title: "Runlevel 5",
    summary: "GUIログイン画面まで起動するマルチユーザー環境です。",
    explanationTitle: "Runlevel 5: graphical / GDMログイン",
    explanation:
      "init 5はマルチユーザー環境に加えてGDMのようなディスプレイマネージャを起動し、GUIログイン画面まで進みます。ここではAlmaLinuxのGDM風画面として視覚化しています。",
    services: [
      ["local login", true],
      ["network", true],
      ["multi-user login", true],
      ["gdm graphical login", true],
    ],
    logs: [
      "# init 5",
      "init: Switching to runlevel: 5",
      "Starting network: [  OK  ]",
      "Starting accounts-daemon: [  OK  ]",
      "Starting display manager: [  OK  ]",
      "gdm.service: Started GNOME Display Manager.",
      "Graphical login screen is ready.",
    ],
    visual: "gdm",
  },
  6: {
    command: "init 6",
    label: "reboot",
    title: "Runlevel 6",
    summary: "システムを再起動します。通常ログイン状態として使うモードではありません。",
    explanationTitle: "Runlevel 6: reboot / 再起動",
    explanation:
      "init 6は再起動処理です。サービス停止、ファイルシステム処理を行ったあと、もう一度起動し直します。作業用ランレベルとして選ぶものではありません。",
    services: [
      ["network", false],
      ["multi-user login", false],
      ["graphical display", false],
      ["reboot sequence", true],
    ],
    logs: [
      "# init 6",
      "init: Switching to runlevel: 6",
      "Stopping gdm: [  OK  ]",
      "Stopping network: [  OK  ]",
      "Unmounting local filesystems: [  OK  ]",
      "Restarting system.",
      "",
      "--- shutdown phase complete ---",
      "BIOS/UEFI: Power on self-test complete",
      "Boot loader: Loading Linux kernel",
      "systemd: Reached target Basic System",
      "systemd: Starting graphical target",
      "Starting network: [  OK  ]",
      "Starting accounts-daemon: [  OK  ]",
      "Starting display manager: [  OK  ]",
      "gdm.service: Started GNOME Display Manager.",
      "Reached runlevel 5: graphical login is ready.",
    ],
    visual: "gdm-reboot-complete",
    intermediateVisual: "reboot",
    completedRunlevel: "5",
  },
};

const shortcutButtons = document.querySelectorAll("[data-command]");
const commandInput = document.querySelector("#command-input");
const runButton = document.querySelector("#run-button");
const resetButton = document.querySelector("#reset-button");
const inputHint = document.querySelector("#input-hint");
const bootLog = document.querySelector("#boot-log");
const stateKicker = document.querySelector("#state-kicker");
const stateTitle = document.querySelector("#state-title");
const stateSummary = document.querySelector("#state-summary");
const serviceList = document.querySelector("#service-list");
const screenPreview = document.querySelector("#screen-preview");
const explanation = document.querySelector("#explanation");

let selectedRunlevel = "0";
let logTimer = null;

function getRunlevelFromCommand(command) {
  const normalized = command.trim().replace(/\s+/g, " ");
  const match = normalized.match(/^init ([01356])$/);
  return match ? match[1] : null;
}

function setCommand(command) {
  commandInput.value = command;
  const level = getRunlevelFromCommand(command);
  if (level) {
    selectedRunlevel = level;
    renderRunlevel(level);
    inputHint.textContent = "入力例: init 5";
    inputHint.classList.remove("error");
  }
  updateShortcutSelection(command);
}

function updateShortcutSelection(command) {
  shortcutButtons.forEach((button) => {
    button.classList.toggle("selected", button.dataset.command === command.trim());
  });
}

function renderRunlevel(level, options = {}) {
  const data = runlevels[level];
  const shouldShowVisual = options.showVisual === true;
  const sourceCommand = options.sourceCommand;

  stateKicker.textContent = sourceCommand
    ? `Completed ${sourceCommand} / now at ${data.command}`
    : `Selected command / ${data.command}`;
  stateTitle.textContent = data.title;
  stateSummary.textContent = data.summary;
  serviceList.innerHTML = data.services
    .map(([name, active]) => {
      const status = active ? "active" : "stopped";
      const lightClass = active ? "service-light" : "service-light off";
      return `<div class="service-item"><span class="${lightClass}" aria-hidden="true"></span><span>${name}: ${status}</span></div>`;
    })
    .join("");

  explanation.innerHTML = `
    <h3>${data.explanationTitle}</h3>
    <p>${data.explanation}</p>
  `;

  if (shouldShowVisual) {
    screenPreview.innerHTML = renderVisual(data.visual);
  } else {
    screenPreview.innerHTML = renderWaitingVisual(data.command);
  }
}

function renderWaitingVisual(command) {
  return `
    <div class="waiting-screen">
      <div>
        <p class="waiting-kicker">waiting for init transition</p>
        <h3>${command} を実行すると、ログ完了後にここが変化します</h3>
        <p>STEP 2の起動ログが最後まで進むと、到達したランレベルの画面に切り替わります。</p>
      </div>
    </div>
  `;
}

function renderVisual(type) {
  if (type === "gdm-reboot-complete") {
    return `
      <div class="gdm-screen" role="img" aria-label="AlmaLinux graphical login after reboot">
        <div class="gdm-topbar">
          <span>May 16 Sat 10:00</span>
          <span>ja JP / Network / Power</span>
        </div>
        <div class="gdm-card">
          <div class="gdm-avatar" aria-hidden="true"></div>
          <h3>Runlevel 5</h3>
          <p>Graphical login after init 6 reboot</p>
          <div class="gdm-password">GDM login screen is ready</div>
        </div>
        <div class="gdm-brand">REBOOT COMPLETE / RUNLEVEL 5</div>
      </div>
    `;
  }

  if (type === "gdm") {
    return `
      <div class="gdm-screen" role="img" aria-label="AlmaLinuxのGDM風ログイン画面">
        <div class="gdm-topbar">
          <span>5月16日 土曜日 10:00</span>
          <span>ja JP  ネットワーク  電源</span>
        </div>
        <div class="gdm-card">
          <div class="gdm-avatar" aria-hidden="true"></div>
          <h3>Student</h3>
          <p>AlmaLinux</p>
          <div class="gdm-password">パスワードを入力</div>
        </div>
        <div class="gdm-brand">ALMALINUX / GDM LOGIN</div>
      </div>
    `;
  }

  if (type === "halt") {
    return `
      <div class="power-screen">
        <div>
          <div class="power-icon">⏻</div>
          <h3>System halted</h3>
          <p class="dim">ログイン画面には進まず、停止状態になります。</p>
        </div>
      </div>
    `;
  }

  if (type === "reboot") {
    return `
      <div class="power-screen">
        <div>
          <div class="power-icon">↻</div>
          <h3>Restarting system</h3>
          <p class="dim">停止処理のあと、もう一度起動し直します。</p>
        </div>
      </div>
    `;
  }

  if (type === "single") {
    return `
      <div class="text-console">
        <p class="dim">AlmaLinux rescue-like maintenance console</p>
        <p>Give root password for maintenance</p>
        <p class="prompt-line">(or press Control-D to continue): _</p>
      </div>
    `;
  }

  return `
    <div class="text-console">
      <p>AlmaLinux 9 localhost.localdomain tty1</p>
      <p>Kernel 5.x on an x86_64</p>
      <p class="prompt-line">localhost login: _</p>
      <p class="dim">GUIではなく、テキストログインの画面です。</p>
    </div>
  `;
}

function runCommand() {
  const level = getRunlevelFromCommand(commandInput.value);

  if (!level) {
    inputHint.textContent = "使えるコマンドは init 0 / init 1 / init 3 / init 5 / init 6 です。";
    inputHint.classList.add("error");
    return;
  }

  selectedRunlevel = level;
  renderRunlevel(level);
  updateShortcutSelection(runlevels[level].command);
  inputHint.textContent = "入力例: init 5";
  inputHint.classList.remove("error");

  const lines = [...runlevels[level].logs];
  let index = 0;

  clearInterval(logTimer);
  bootLog.textContent = "";
  screenPreview.innerHTML = renderWaitingVisual(runlevels[level].command);
  runButton.disabled = true;
  runButton.textContent = "実行中...";

  logTimer = setInterval(() => {
    bootLog.textContent += `${lines[index]}\n`;
    bootLog.scrollTop = bootLog.scrollHeight;
    if (runlevels[level].intermediateVisual && lines[index] === "Restarting system.") {
      screenPreview.innerHTML = renderVisual(runlevels[level].intermediateVisual);
    }
    index += 1;

    if (index >= lines.length) {
      clearInterval(logTimer);
      const finalLevel = runlevels[level].completedRunlevel || level;
      renderRunlevel(finalLevel, {
        showVisual: true,
        sourceCommand: finalLevel === level ? null : runlevels[level].command,
      });
      screenPreview.innerHTML = renderVisual(runlevels[level].visual);
      runButton.disabled = false;
      runButton.textContent = "実行する";
    }
  }, 420);
}

function resetExperience() {
  clearInterval(logTimer);
  runButton.disabled = false;
  runButton.textContent = "実行する";
  commandInput.value = "";
  updateShortcutSelection(runlevels[selectedRunlevel].command);
  renderRunlevel(selectedRunlevel);
  inputHint.textContent = "入力例: init 5";
  inputHint.classList.remove("error");
  bootLog.textContent = `ターミナルで init 数字 を実行してください。\n\n例:\n# ${runlevels[selectedRunlevel].command}`;
}

shortcutButtons.forEach((button) => {
  button.addEventListener("click", () => setCommand(button.dataset.command));
});

commandInput.addEventListener("input", () => {
  const level = getRunlevelFromCommand(commandInput.value);
  updateShortcutSelection(commandInput.value);
  if (level) {
    selectedRunlevel = level;
    renderRunlevel(level);
    inputHint.textContent = "入力例: init 5";
    inputHint.classList.remove("error");
  }
});

commandInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runCommand();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  const activeTag = document.activeElement?.tagName;
  if (["A", "BUTTON", "INPUT"].includes(activeTag)) {
    return;
  }

  runCommand();
});

runButton.addEventListener("click", runCommand);
resetButton.addEventListener("click", resetExperience);

renderRunlevel(selectedRunlevel);
