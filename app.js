const targets = {
  "rescue.target": {
    title: "rescue.target",
    summary: "通常のシステムを最小限まで起動し、root パスワード入力後に保守用シェルへ入ります。",
    lineSuffix: "systemd.unit=rescue.target",
    services: [
      ["basic system", true],
      ["local filesystems", true],
      ["network", false],
      ["graphical display", false],
    ],
    logs: [
      "GRUB2: AlmaLinux を選択",
      "キー入力: e",
      "編集モード: linux 行の末尾へ systemd.unit=rescue.target を追加",
      "キー入力: Ctrl + X",
      "systemd: Starting Rescue Mode...",
      "systemd: Reached target Rescue Mode.",
      "Give root password for maintenance",
      "(or press Control-D to continue):",
    ],
    explanation:
      "rescue.target は、通常の起動処理をある程度進めたうえで保守用シェルに入る target です。パスワード修復や設定変更など、限定的な作業をする時に使います。",
    visual: "rescue",
  },
  "emergency.target": {
    title: "emergency.target",
    summary: "できるだけ早く root シェルへ入る、さらに最小構成の緊急用 target です。",
    lineSuffix: "systemd.unit=emergency.target",
    services: [
      ["root shell", true],
      ["local filesystems", false],
      ["network", false],
      ["graphical display", false],
    ],
    logs: [
      "GRUB2: AlmaLinux を選択",
      "キー入力: e",
      "編集モード: linux 行の末尾へ systemd.unit=emergency.target を追加",
      "キー入力: F10",
      "systemd: Starting Emergency Shell...",
      "systemd: Reached target Emergency Mode.",
      "Welcome to emergency mode!",
      "Press Enter for maintenance",
    ],
    explanation:
      "emergency.target は、rescue.target よりさらに少ないサービスで起動します。ファイルシステムや通常サービスに問題がある場合の初期対応をイメージしてください。",
    visual: "emergency",
  },
  "multi-user.target": {
    title: "multi-user.target",
    summary: "ネットワークありのマルチユーザー CUI 環境です。従来の runlevel 3 に近い状態です。",
    lineSuffix: "systemd.unit=multi-user.target",
    services: [
      ["local login", true],
      ["network", true],
      ["ssh or remote login", true],
      ["graphical display", false],
    ],
    logs: [
      "GRUB2: AlmaLinux を選択",
      "キー入力: e",
      "編集モード: linux 行の末尾へ systemd.unit=multi-user.target を追加",
      "キー入力: Ctrl + X",
      "systemd: Starting Multi-User System...",
      "Started Network Manager.",
      "Started OpenSSH server daemon.",
      "Reached target Multi-User System.",
      "localhost login:",
    ],
    explanation:
      "multi-user.target は GUI を起動せず、複数ユーザーのログインやネットワーク利用を可能にする target です。サーバー用途の基本状態として扱われます。",
    visual: "tty",
  },
  "graphical.target": {
    title: "graphical.target",
    summary: "GUI ログイン画面まで起動します。従来の runlevel 5 に近い状態です。",
    lineSuffix: "systemd.unit=graphical.target",
    services: [
      ["local login", true],
      ["network", true],
      ["multi-user login", true],
      ["gdm graphical login", true],
    ],
    logs: [
      "GRUB2: AlmaLinux を選択",
      "キー入力: e",
      "編集モード: linux 行の末尾へ systemd.unit=graphical.target を追加",
      "キー入力: F10",
      "systemd: Starting Graphical Interface...",
      "Started GNOME Display Manager.",
      "Reached target Graphical Interface.",
      "Graphical login screen is ready.",
    ],
    explanation:
      "graphical.target は multi-user.target の機能に加えて、ディスプレイマネージャーを起動する target です。デスクトップ環境の通常起動を表します。",
    visual: "gdm",
  },
};

const runlevels = {
  0: {
    command: "init 0",
    systemctlCommand: "systemctl poweroff",
    label: "halt",
    title: "Runlevel 0",
    summary: "システムを停止します。ログイン画面には到達しません。",
    explanationTitle: "Runlevel 0: halt / システム停止",
    explanation:
      "init 0 は停止処理です。サービスを止め、ファイルシステムを安全に処理し、最後に電源断できる状態へ向かいます。作業用のランレベルではありません。",
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
    systemctlLogs: [
      "# systemctl poweroff",
      "systemd: Starting Power-Off...",
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
    systemctlCommand: "systemctl rescue",
    label: "single-user",
    title: "Runlevel 1",
    summary: "管理者だけが入る保守モードです。ネットワークや複数ユーザー利用は基本的に使いません。",
    explanationTitle: "Runlevel 1: single-user / 保守モード",
    explanation:
      "init 1 は単一ユーザーモードへ移行します。トラブル対応やパスワード復旧など、最小限のサービスだけで修復したい場面をイメージしてください。",
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
    systemctlLogs: [
      "# systemctl rescue",
      "systemd: Switching to rescue.target",
      "Stopping display manager: [  OK  ]",
      "Stopping network: [  OK  ]",
      "Starting rescue shell: [  OK  ]",
      "Give root password for maintenance",
      "(or press Control-D to continue):",
    ],
    visual: "single",
  },
  3: {
    command: "init 3",
    systemctlCommand: "systemctl isolate multi-user.target",
    label: "multi-user text",
    title: "Runlevel 3",
    summary: "ネットワークありの CUI マルチユーザー環境として起動します。",
    explanationTitle: "Runlevel 3: multi-user text / CUI ログイン",
    explanation:
      "init 3 は GUI なしのマルチユーザー環境へ移行します。systemd では multi-user.target に近い状態です。",
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
    systemctlLogs: [
      "# systemctl isolate multi-user.target",
      "systemd: Switching to multi-user.target",
      "Stopping display manager: [  OK  ]",
      "Starting network: [  OK  ]",
      "Starting sshd: [  OK  ]",
      "Reached target Multi-User System.",
      "localhost login:",
    ],
    visual: "tty",
  },
  5: {
    command: "init 5",
    systemctlCommand: "systemctl isolate graphical.target",
    label: "graphical",
    title: "Runlevel 5",
    summary: "GUI ログイン画面まで起動するマルチユーザー環境です。",
    explanationTitle: "Runlevel 5: graphical / GDM ログイン",
    explanation:
      "init 5 はマルチユーザー環境に加えて、GDM のようなディスプレイマネージャーを起動し、GUI ログイン画面まで進みます。systemd では graphical.target に近い状態です。",
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
    systemctlLogs: [
      "# systemctl isolate graphical.target",
      "systemd: Switching to graphical.target",
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
    systemctlCommand: "systemctl reboot",
    label: "reboot",
    title: "Runlevel 6",
    summary: "システムを再起動します。通常ログイン状態として使うモードではありません。",
    explanationTitle: "Runlevel 6: reboot / 再起動",
    explanation:
      "init 6 は再起動処理です。サービス停止、ファイルシステム処理を行ったあと、もう一度起動し直します。作業用ランレベルとして選ぶものではありません。",
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
      "Starting display manager: [  OK  ]",
      "gdm.service: Started GNOME Display Manager.",
      "Reached runlevel 5: graphical login is ready.",
    ],
    systemctlLogs: [
      "# systemctl reboot",
      "systemd: Starting Reboot...",
      "Stopping gdm: [  OK  ]",
      "Stopping network: [  OK  ]",
      "Unmounting local filesystems: [  OK  ]",
      "Restarting system.",
      "",
      "--- shutdown phase complete ---",
      "BIOS/UEFI: Power on self-test complete",
      "Boot loader: Loading Linux kernel",
      "systemd: Reached target Basic System",
      "systemd: Starting graphical.target",
      "Starting display manager: [  OK  ]",
      "gdm.service: Started GNOME Display Manager.",
      "Reached runlevel 5: graphical login is ready.",
    ],
    visual: "gdm-reboot-complete",
    intermediateVisual: "reboot",
    completedRunlevel: "5",
  },
};

const grubPreview = document.querySelector("#grub-preview");
const grubEditButton = document.querySelector("#grub-edit-button");
const grubTargetInput = document.querySelector("#grub-target-input");
const grubBootButton = document.querySelector("#grub-boot-button");
const grubResetButton = document.querySelector("#grub-reset-button");
const grubHint = document.querySelector("#grub-hint");

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

let selectedTarget = null;
let grubMode = "menu";
let selectedRunlevel = "0";
let logTimer = null;
let grubTimer = null;

function getCommandAction(command) {
  const normalized = command.trim().replace(/\s+/g, " ");
  const initMatch = normalized.match(/^init ([01356])$/);

  if (initMatch) {
    return {
      level: initMatch[1],
      command: normalized,
      mode: "init",
    };
  }

  const systemctlMatch = Object.entries(runlevels).find(([, data]) => data.systemctlCommand === normalized);

  if (systemctlMatch) {
    return {
      level: systemctlMatch[0],
      command: normalized,
      mode: "systemctl",
    };
  }

  return null;
}

function setCommand(command) {
  commandInput.value = command;
  const action = getCommandAction(command);
  if (action) {
    selectedRunlevel = action.level;
    renderRunlevel(action.level, { displayCommand: action.command });
    inputHint.textContent = "入力例: init 5 / systemctl isolate graphical.target";
    inputHint.classList.remove("error");
  }
  updateShortcutSelection(command);
}

function updateShortcutSelection(command) {
  shortcutButtons.forEach((button) => {
    button.classList.toggle("selected", button.dataset.command === command.trim());
  });
}

function renderGrubPreview(mode = "menu") {
  grubMode = mode;
  const typedSuffix = grubTargetInput.value.trim();
  const linuxLine = "linux /vmlinuz-5.x root=/dev/mapper/almalinux-root ro quiet";
  const editableLinuxLine = typedSuffix ? `${linuxLine} ${typedSuffix}` : `${linuxLine} _`;

  if (mode === "booting") {
    const target = targets[selectedTarget];
    grubPreview.innerHTML = renderTargetBoot(target);
    return;
  }

  if (mode === "result") {
    const target = targets[selectedTarget];
    grubPreview.innerHTML = renderVisual(target.visual);
    return;
  }

  if (mode === "edit") {
    grubPreview.innerHTML = `
      <div class="grub-screen edit-mode">
        <p class="grub-title">GRUB2 edit mode</p>
        <pre>setparams 'AlmaLinux'

load_video
set gfxpayload=keep
insmod gzio
${editableLinuxLine}
initrd /initramfs-5.x.img</pre>
        <p class="grub-footer">入力欄に systemd.unit=target名 を手動で入力し、Ctrl + X / F10 で起動</p>
      </div>
    `;
    return;
  }

  grubPreview.innerHTML = `
    <div class="grub-screen">
      <p class="grub-title">GNU GRUB version 2.x</p>
      <div class="grub-menu-item selected">AlmaLinux (5.x) 9.x</div>
      <div class="grub-menu-item">AlmaLinux (5.x) rescue</div>
      <div class="grub-menu-item">UEFI Firmware Settings</div>
      <p class="grub-footer">起動項目を選び、e キーで編集モードへ</p>
    </div>
  `;
}

function enterGrubEditMode() {
  clearInterval(grubTimer);
  selectedTarget = null;
  grubTargetInput.disabled = false;
  grubBootButton.disabled = false;
  grubEditButton.disabled = true;
  grubHint.textContent = "linux 行の末尾に systemd.unit=target名 を入力してください。";
  grubHint.classList.remove("error");
  grubTargetInput.focus();
  renderGrubPreview("edit");
}

function getTargetFromGrubInput() {
  const suffix = grubTargetInput.value.trim().replace(/\s+/g, " ");
  const matchedTargetName = Object.keys(targets).find((targetName) => {
    return suffix === targets[targetName].lineSuffix;
  });

  return matchedTargetName || null;
}

function runGrubBoot() {
  if (grubMode !== "edit") {
    grubHint.textContent = "まず e を押して編集モードに入ります。";
    grubHint.classList.add("error");
    return;
  }

  const targetName = getTargetFromGrubInput();

  if (!targetName) {
    grubHint.textContent = "その記述では起動できません";
    grubHint.classList.add("error");
    renderGrubPreview("edit");
    return;
  }

  selectedTarget = targetName;
  const target = targets[targetName];
  const lines = [...target.logs];
  let index = 0;

  clearInterval(grubTimer);
  grubHint.textContent = `${target.title} を指定して起動します。`;
  grubHint.classList.remove("error");
  grubTargetInput.disabled = true;
  grubEditButton.disabled = true;
  grubBootButton.disabled = true;
  grubBootButton.textContent = "起動中...";
  grubPreview.innerHTML = renderTargetBoot(target, "");

  grubTimer = setInterval(() => {
    const visibleLines = lines.slice(0, index + 1).join("\n");
    grubPreview.innerHTML = renderTargetBoot(target, visibleLines);
    index += 1;

    if (index >= lines.length) {
      clearInterval(grubTimer);
      grubBootButton.disabled = false;
      grubEditButton.disabled = false;
      grubBootButton.textContent = "Ctrl + X / F10 で起動";
      grubPreview.innerHTML = renderVisual(target.visual);
      renderSystemState({
        kicker: `Booted from GRUB2 / ${target.title}`,
        title: target.title,
        summary: target.summary,
        services: target.services,
        explanationTitle: `GRUB2 boot: ${target.title}`,
        explanationText: target.explanation,
      });
    }
  }, 420);
}

function renderTargetBoot(target, logText = "") {
  return `
    <div class="text-console">
      <p class="dim">Booting with ${target.title}</p>
      <pre class="inline-log">${logText || "GRUB2 edit saved. Loading kernel..."}</pre>
    </div>
  `;
}

function renderSystemState({ kicker, title, summary, services, explanationTitle, explanationText }) {
  stateKicker.textContent = kicker;
  stateTitle.textContent = title;
  stateSummary.textContent = summary;
  serviceList.innerHTML = services
    .map(([name, active]) => {
      const status = active ? "active" : "stopped";
      const lightClass = active ? "service-light" : "service-light off";
      return `<div class="service-item"><span class="${lightClass}" aria-hidden="true"></span><span>${name}: ${status}</span></div>`;
    })
    .join("");

  explanation.innerHTML = `
    <h3>${explanationTitle}</h3>
    <p>${explanationText}</p>
  `;
}

function renderRunlevel(level, options = {}) {
  const data = runlevels[level];
  const shouldShowVisual = options.showVisual === true;
  const sourceCommand = options.sourceCommand;
  const displayCommand = options.displayCommand || data.command;

  renderSystemState({
    kicker: sourceCommand ? `Completed ${sourceCommand} / now at ${displayCommand}` : `Selected command / ${displayCommand}`,
    title: data.title,
    summary: data.summary,
    services: data.services,
    explanationTitle: data.explanationTitle,
    explanationText: data.explanation,
  });

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
        <p>STEP 2 の起動ログが最後まで進むと、到達したランレベルの画面に切り替わります。</p>
      </div>
    </div>
  `;
}

function renderVisual(type) {
  if (type === "gdm-reboot-complete") {
    return `
      <div class="gdm-screen" role="img" aria-label="再起動後の AlmaLinux GUI ログイン画面">
        <div class="gdm-topbar">
          <span>5月16日 土曜日 10:00</span>
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
      <div class="gdm-screen" role="img" aria-label="AlmaLinux の GDM ログイン画面">
        <div class="gdm-topbar">
          <span>5月16日 土曜日 10:00</span>
          <span>ja JP / Network / Power</span>
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
          <div class="power-icon">OFF</div>
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
          <div class="power-icon">RST</div>
          <h3>Restarting system</h3>
          <p class="dim">停止処理のあと、もう一度起動し直します。</p>
        </div>
      </div>
    `;
  }

  if (type === "single" || type === "rescue") {
    return `
      <div class="text-console">
        <p class="dim">AlmaLinux rescue-like maintenance console</p>
        <p>Give root password for maintenance</p>
        <p class="prompt-line">(or press Control-D to continue): _</p>
      </div>
    `;
  }

  if (type === "emergency") {
    return `
      <div class="text-console">
        <p>Welcome to emergency mode!</p>
        <p>After logging in, type "journalctl -xb" to view system logs.</p>
        <p class="prompt-line">Press Enter for maintenance _</p>
        <p class="dim">最小構成で root シェルに入る緊急用 target です。</p>
      </div>
    `;
  }

  return `
    <div class="text-console">
      <p>AlmaLinux 9 localhost.localdomain tty1</p>
      <p>Kernel 5.x on an x86_64</p>
      <p class="prompt-line">localhost login: _</p>
      <p class="dim">GUI ではなく、テキストログインの画面です。</p>
    </div>
  `;
}

function runCommand() {
  const action = getCommandAction(commandInput.value);

  if (!action) {
    inputHint.textContent = "使えるコマンドは init 0 / init 1 / init 3 / init 5 / init 6 または対応する systemctl コマンドです。";
    inputHint.classList.add("error");
    return;
  }

  const level = action.level;
  const data = runlevels[level];
  const lines = action.mode === "systemctl" ? [...data.systemctlLogs] : [...data.logs];

  selectedRunlevel = level;
  renderRunlevel(level, { displayCommand: action.command });
  updateShortcutSelection(action.command);
  inputHint.textContent = "入力例: init 5 / systemctl isolate graphical.target";
  inputHint.classList.remove("error");

  let index = 0;

  clearInterval(logTimer);
  bootLog.textContent = "";
  screenPreview.innerHTML = renderWaitingVisual(action.command);
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
      const finalLevel = data.completedRunlevel || level;
      renderRunlevel(finalLevel, {
        showVisual: true,
        sourceCommand: finalLevel === level ? null : action.command,
        displayCommand: finalLevel === level ? action.command : undefined,
      });
      screenPreview.innerHTML = renderVisual(data.visual);
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
  inputHint.textContent = "入力例: init 5 / systemctl isolate graphical.target";
  inputHint.classList.remove("error");
  bootLog.textContent = `端末で init 数字、または対応する systemctl コマンドを実行してください。\n\n例:\n# ${runlevels[selectedRunlevel].command}\n# ${runlevels[selectedRunlevel].systemctlCommand}`;
}

grubEditButton.addEventListener("click", enterGrubEditMode);
grubBootButton.addEventListener("click", runGrubBoot);
grubResetButton.addEventListener("click", () => {
  clearInterval(grubTimer);
  selectedTarget = null;
  grubTargetInput.value = "";
  grubTargetInput.disabled = true;
  grubEditButton.disabled = false;
  grubBootButton.disabled = false;
  grubBootButton.disabled = true;
  grubBootButton.textContent = "Ctrl + X / F10 で起動";
  grubHint.textContent = "まず e を押して編集モードに入ります。";
  grubHint.classList.remove("error");
  renderGrubPreview("menu");
});

grubTargetInput.addEventListener("input", () => {
  if (grubMode === "edit") {
    grubHint.textContent = "Ctrl + X / F10 で起動します。記述が違う場合はエラーになります。";
    grubHint.classList.remove("error");
    renderGrubPreview("edit");
  }
});

grubTargetInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey && event.key.toLowerCase() === "x") || event.key === "F10" || event.key === "Enter") {
    event.preventDefault();
    runGrubBoot();
  }
});

shortcutButtons.forEach((button) => {
  button.addEventListener("click", () => setCommand(button.dataset.command));
});

commandInput.addEventListener("input", () => {
  const action = getCommandAction(commandInput.value);
  updateShortcutSelection(commandInput.value);
  if (action) {
    selectedRunlevel = action.level;
    renderRunlevel(action.level, { displayCommand: action.command });
    inputHint.textContent = "入力例: init 5 / systemctl isolate graphical.target";
    inputHint.classList.remove("error");
  }
});

commandInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runCommand();
  }
});

document.addEventListener("keydown", (event) => {
  const activeTag = document.activeElement?.tagName;

  if (grubMode === "menu" && event.key.toLowerCase() === "e" && !["INPUT", "TEXTAREA"].includes(activeTag)) {
    event.preventDefault();
    event.stopPropagation();
    enterGrubEditMode();
    return;
  }

  if (event.key !== "Enter") {
    return;
  }

  if (["A", "BUTTON", "INPUT"].includes(activeTag)) {
    return;
  }

  runCommand();
});

runButton.addEventListener("click", runCommand);
resetButton.addEventListener("click", resetExperience);

renderGrubPreview("menu");
renderRunlevel(selectedRunlevel);
