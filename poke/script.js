'use strict';
// ===================================================
// PotaKB Configurator v2.0 — メインスクリプト
// ===================================================

// ===================================================
// 1. キーコード定義マップ  value → {name, label, category}
// ===================================================
const KC_MAP = (() => {
  const m = new Map();
  const add = (value, name, label, category) => m.set(value, { name, label, category });

  // 特殊
  add(0x0000, 'KC_NO',          '×',         'special');
  add(0xFFFF, 'KC_TRNS',        '▽',         'special');
  add(0x5001, 'MO(1)',          'MO(1)',      'special');
  add(0x4001, 'SW_MODE',        'SW Mode',    'special');
  add(0x4002, 'KC_CALIBRATE',   'Calib',      'special');
  add(0x4003, 'KC_RESET',       'Reset',      'special');
  add(0x4004, 'KC_REBOOT',      'Reboot',     'special');

  // アルファベット
  const A = 0x04;
  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(65 + i); // A..Z
    add(A + i, `HID_KEY_${ch}`, ch, 'letters');
  }

  // 数字行 (1..0)
  add(0x1E, 'HID_KEY_1', '1', 'numbers');
  add(0x1F, 'HID_KEY_2', '2', 'numbers');
  add(0x20, 'HID_KEY_3', '3', 'numbers');
  add(0x21, 'HID_KEY_4', '4', 'numbers');
  add(0x22, 'HID_KEY_5', '5', 'numbers');
  add(0x23, 'HID_KEY_6', '6', 'numbers');
  add(0x24, 'HID_KEY_7', '7', 'numbers');
  add(0x25, 'HID_KEY_8', '8', 'numbers');
  add(0x26, 'HID_KEY_9', '9', 'numbers');
  add(0x27, 'HID_KEY_0', '0', 'numbers');

  // ファンクションキー
  for (let i = 1; i <= 12; i++) {
    add(0x39 + i, `HID_KEY_F${i}`, `F${i}`, 'fn');
    // 0x3A=F1 ... 0x45=F12
  }

  // 修飾キー
  add(0xE0, 'HID_KEY_CONTROL_LEFT',  'LCtrl',  'mods');
  add(0xE1, 'HID_KEY_SHIFT_LEFT',    'LShift', 'mods');
  add(0xE2, 'HID_KEY_ALT_LEFT',      'LAlt',   'mods');
  add(0xE3, 'HID_KEY_GUI_LEFT',      'LGui',   'mods');
  add(0xE4, 'HID_KEY_CONTROL_RIGHT', 'RCtrl',  'mods');
  add(0xE5, 'HID_KEY_SHIFT_RIGHT',   'RShift', 'mods');
  add(0xE6, 'HID_KEY_ALT_RIGHT',     'RAlt',   'mods');
  add(0xE7, 'HID_KEY_GUI_RIGHT',     'RGui',   'mods');

  // 編集
  add(0x28, 'HID_KEY_ENTER',     'Enter', 'edit');
  add(0x29, 'HID_KEY_ESCAPE',    'Esc',   'edit');
  add(0x2A, 'HID_KEY_BACKSPACE', 'BkSp',  'edit');
  add(0x2B, 'HID_KEY_TAB',       'Tab',   'edit');
  add(0x2C, 'HID_KEY_SPACE',     'Space', 'edit');
  add(0x4C, 'HID_KEY_DELETE',    'Del',   'edit');
  add(0x39, 'HID_KEY_CAPS_LOCK', 'Caps',  'edit');
  add(0x65, 'HID_KEY_APPLICATION','Menu', 'edit');

  // ナビゲーション
  add(0x49, 'HID_KEY_INSERT',      'Ins',    'nav');
  add(0x4A, 'HID_KEY_HOME',        'Home',   'nav');
  add(0x4B, 'HID_KEY_PAGE_UP',     'PgUp',   'nav');
  add(0x4D, 'HID_KEY_END',         'End',    'nav');
  add(0x4E, 'HID_KEY_PAGE_DOWN',   'PgDn',   'nav');
  add(0x4F, 'HID_KEY_ARROW_RIGHT', '→',      'nav');
  add(0x50, 'HID_KEY_ARROW_LEFT',  '←',      'nav');
  add(0x51, 'HID_KEY_ARROW_DOWN',  '↓',      'nav');
  add(0x52, 'HID_KEY_ARROW_UP',    '↑',      'nav');
  add(0x46, 'HID_KEY_PRINT_SCREEN','PrtSc',  'nav');
  add(0x47, 'HID_KEY_SCROLL_LOCK', 'ScLk',   'nav');
  add(0x48, 'HID_KEY_PAUSE',       'Pause',  'nav');

  // 記号
  add(0x2D, 'HID_KEY_MINUS',         '-',  'symbols');
  add(0x2E, 'HID_KEY_EQUAL',         '=',  'symbols');
  add(0x2F, 'HID_KEY_BRACKET_LEFT',  '[',  'symbols');
  add(0x30, 'HID_KEY_BRACKET_RIGHT', ']',  'symbols');
  add(0x31, 'HID_KEY_BACKSLASH',     '\\', 'symbols');
  add(0x33, 'HID_KEY_SEMICOLON',     ';',  'symbols');
  add(0x34, 'HID_KEY_APOSTROPHE',    "'",  'symbols');
  add(0x35, 'HID_KEY_GRAVE',         '`',  'symbols');
  add(0x36, 'HID_KEY_COMMA',         ',',  'symbols');
  add(0x37, 'HID_KEY_PERIOD',        '.',  'symbols');
  add(0x38, 'HID_KEY_SLASH',         '/',  'symbols');

  // 日本語
  add(0x89, 'HID_KEY_INTERNATIONAL1', 'ろ/\\', 'jp');
  add(0x87, 'HID_KEY_INTERNATIONAL3', '¥',     'jp');
  add(0x90, 'HID_KEY_LANG1',          'かな',  'jp');
  add(0x91, 'HID_KEY_LANG2',          '英数',  'jp');

  // マウス
  add(0x2001, 'KC_MS_UP',        'M↑',     'mouse');
  add(0x2002, 'KC_MS_DOWN',      'M↓',     'mouse');
  add(0x2003, 'KC_MS_LEFT',      'M←',     'mouse');
  add(0x2004, 'KC_MS_RIGHT',     'M→',     'mouse');
  add(0x2005, 'KC_MS_BTN1',      'M-Btn1', 'mouse');
  add(0x2006, 'KC_MS_BTN2',      'M-Btn2', 'mouse');
  add(0x2007, 'KC_MS_BTN3',      'M-Btn3', 'mouse');
  add(0x2008, 'KC_MS_BTN4',      'M-Btn4', 'mouse');
  add(0x2009, 'KC_MS_BTN5',      'M-Btn5', 'mouse');
  add(0x200A, 'KC_MS_SCR_UP',    'Scr↑',   'mouse');
  add(0x200B, 'KC_MS_SCR_DOWN',  'Scr↓',   'mouse');
  add(0x200C, 'KC_MS_SCR_LEFT',  'Scr←',   'mouse');
  add(0x200D, 'KC_MS_SCR_RIGHT', 'Scr→',   'mouse');

  return m;
})();

// キーコード値からラベル文字列を取得
function kcLabel(v) {
  const e = KC_MAP.get(v);
  if (e) return e.label;
  return `0x${v.toString(16).toUpperCase().padStart(4,'0')}`;
}
// キーコード値からname文字列を取得
function kcName(v) {
  const e = KC_MAP.get(v);
  if (e) return e.name;
  return `0x${v.toString(16).toUpperCase().padStart(4,'0')}`;
}

// ===================================================
// 2. キーボードレイアウト定義
// ===================================================
const UNIT = 44; // px / 1u
const GAP  = 4;  // px

// レイアウト: 各行 [{idx, u, label} | {gap, u}]
// u: キー幅 (単位u), label: オプション表示ラベル (省略時はキーコードラベルを表示)
// gap: true のとき不可視スペーサー (u分の幅を空ける)
// 実際の物理レイアウト (keyboard-layout.json より)
const KEY_ROWS = [
  // Row0: マウスボタン — sw1(1.5u) ... 12u空白 ... sw62(1.5u)
  { cls: 'key-row-mouse', keys: [
    { idx: 0, u: 1.5, label: 'Btn1' },
    { gap: true, u: 12 },
    { idx: 1, u: 1.5, label: 'Btn2' },
  ]},
  // Row1: 数字行 15x1u
  { keys: [
    { idx: 2,  u: 1 }, { idx: 3,  u: 1 }, { idx: 4,  u: 1 }, { idx: 5,  u: 1 },
    { idx: 6,  u: 1 }, { idx: 7,  u: 1 }, { idx: 8,  u: 1 }, { idx: 9,  u: 1 },
    { idx: 10, u: 1 }, { idx: 11, u: 1 }, { idx: 12, u: 1 }, { idx: 13, u: 1 },
    { idx: 14, u: 1 }, { idx: 15, u: 1 }, { idx: 16, u: 1 },
  ]},
  // Row2: Q行 — 1.5u + 12x1u + 1.5u
  { keys: [
    { idx: 17, u: 1.5 }, { idx: 18, u: 1 }, { idx: 19, u: 1 }, { idx: 20, u: 1 },
    { idx: 21, u: 1   }, { idx: 22, u: 1 }, { idx: 23, u: 1 }, { idx: 24, u: 1 },
    { idx: 25, u: 1   }, { idx: 26, u: 1 }, { idx: 27, u: 1 }, { idx: 28, u: 1 },
    { idx: 29, u: 1   }, { idx: 30, u: 1.5 },
  ]},
  // Row3: A行 — 1.75u + 12x1u + 1.25u
  { keys: [
    { idx: 31, u: 1.75 }, { idx: 32, u: 1 }, { idx: 33, u: 1 }, { idx: 34, u: 1 },
    { idx: 35, u: 1    }, { idx: 36, u: 1 }, { idx: 37, u: 1 }, { idx: 38, u: 1 },
    { idx: 39, u: 1    }, { idx: 40, u: 1 }, { idx: 41, u: 1 }, { idx: 42, u: 1 },
    { idx: 43, u: 1    }, { idx: 44, u: 1.25 },
  ]},
  // Row4: Z行 — 2u空白(スティック) + 11x1u + 1.5u(LShift)
  { keys: [
    { gap: true, u: 2 },
    { idx: 45, u: 1 }, { idx: 46, u: 1 }, { idx: 47, u: 1 }, { idx: 48, u: 1 },
    { idx: 49, u: 1 }, { idx: 50, u: 1 }, { idx: 51, u: 1 }, { idx: 52, u: 1 },
    { idx: 53, u: 1 }, { idx: 54, u: 1 }, { idx: 55, u: 1 }, { idx: 56, u: 1.5 },
  ]},
  // Row5: 底面 — 6u空白(スティック) + 2.5u(Space) + 5x1u
  { keys: [
    { gap: true, u: 6 },
    { idx: 57, u: 2.5 }, { idx: 58, u: 1 }, { idx: 59, u: 1 },
    { idx: 60, u: 1   }, { idx: 61, u: 1 }, { idx: 62, u: 1 },
  ]},
  // DirectKeys
  { cls: 'key-row-direct', keys: [
    { idx: 63, u: 1, label: 'Next' },
    { idx: 64, u: 1, label: 'Back' },
  ]},
];

// ===================================================
// 3. アプリケーション状態
// ===================================================
const NUM_LAYERS = 2;
const NUM_KEYS   = 65;

// keymapData[layer][keyIndex] = keycode (uint16)
let keymapData = Array.from({ length: NUM_LAYERS }, () => new Uint16Array(NUM_KEYS).fill(0x0000));

// 選択中のキーインデックス配列
let selectedKeys = [];

// キャプチャモード (trueのとき次のkeydownを割り当て)
let captureMode = false;

// ===================================================
// event.code → HID keycode マッピング
// ===================================================
const EVENT_CODE_TO_HID = {
  // アルファベット
  KeyA:0x04, KeyB:0x05, KeyC:0x06, KeyD:0x07, KeyE:0x08, KeyF:0x09,
  KeyG:0x0A, KeyH:0x0B, KeyI:0x0C, KeyJ:0x0D, KeyK:0x0E, KeyL:0x0F,
  KeyM:0x10, KeyN:0x11, KeyO:0x12, KeyP:0x13, KeyQ:0x14, KeyR:0x15,
  KeyS:0x16, KeyT:0x17, KeyU:0x18, KeyV:0x19, KeyW:0x1A, KeyX:0x1B,
  KeyY:0x1C, KeyZ:0x1D,
  // 数字
  Digit1:0x1E, Digit2:0x1F, Digit3:0x20, Digit4:0x21, Digit5:0x22,
  Digit6:0x23, Digit7:0x24, Digit8:0x25, Digit9:0x26, Digit0:0x27,
  // 編集
  Enter:0x28, Escape:0x29, Backspace:0x2A, Tab:0x2B, Space:0x2C,
  Delete:0x4C, Insert:0x49, CapsLock:0x39,
  // 記号
  Minus:0x2D, Equal:0x2E, BracketLeft:0x2F, BracketRight:0x30,
  Backslash:0x31, Semicolon:0x33, Quote:0x34, Backquote:0x35,
  Comma:0x36, Period:0x37, Slash:0x38,
  // ナビゲーション
  Home:0x4A, End:0x4D, PageUp:0x4B, PageDown:0x4E,
  ArrowRight:0x4F, ArrowLeft:0x50, ArrowDown:0x51, ArrowUp:0x52,
  PrintScreen:0x46, ScrollLock:0x47, Pause:0x48,
  // ファンクション
  F1:0x3A, F2:0x3B, F3:0x3C,  F4:0x3D, F5:0x3E, F6:0x3F,
  F7:0x40, F8:0x41, F9:0x42, F10:0x43, F11:0x44, F12:0x45,
  // 修飾
  ControlLeft:0xE0, ShiftLeft:0xE1, AltLeft:0xE2, MetaLeft:0xE3,
  ControlRight:0xE4, ShiftRight:0xE5, AltRight:0xE6, MetaRight:0xE7,
  ContextMenu:0x65,
  // 日本語 (JIS)
  IntlRo:0x89, IntlYen:0x87, Lang1:0x90, Lang2:0x91,
};

// 現在表示中のレイヤー
let currentLayer = 0;

// 現在のパレットカテゴリ
let currentPaletteCat = 'special';

// Config オブジェクト
let config = getDefaultConfig();

// 接続状態
let connState = 'disconnected'; // 'disconnected' | 'connecting' | 'connected'
let connMode  = 'ble';          // 'ble' | 'usb'

// BLE関連
let bleDevice    = null;
let bleServer    = null;
let keymapChar   = null;
let configChar   = null;
let battChar     = null;

// USB Serial関連
let usbPort      = null;
let usbReader    = null;
let usbWriter    = null;
let usbReadable  = null;

// BLE UUIDs
const BLE_SERVICE_UUID  = 'adaf0001-c332-42a8-93bd-25e905756cb8';
const BLE_KEYMAP_UUID   = 'adaf0002-c332-42a8-93bd-25e905756cb8';
const BLE_CONFIG_UUID   = 'adaf0003-c332-42a8-93bd-25e905756cb8';
const BLE_BATTERY_SVC   = 0x180f;
const BLE_BATTERY_CHAR  = 0x2a19;

// ===================================================
// 4. デフォルト設定値
// ===================================================
function getDefaultConfig() {
  return {
    version:         3,
    stick_center_x:  512,
    stick_center_y:  512,
    stick_deadzone:  75,
    stick_range_x:   511,
    stick_range_y:   511,
    stick_ema_alpha: 0.4,
    mouse_max_speed: 0.8,
    scroll_max_speed:0.06,
    sleep_timeout_ms:300000,
    led_brightness:  25,
    blink_interval_ms:600,
    scroll_invert:   0,
    magic:           0x504F5441,
  };
}

// ===================================================
// 5. 初期化
// ===================================================
window.addEventListener('DOMContentLoaded', () => {
  buildKeyboard();
  renderKeyboard();
  buildPalette('special');
  syncConfigToForm();
  addLog('info', 'PotaKB Configurator v2.0 起動完了');
});

// ===================================================
// 6. キーボードビジュアル描画
// ===================================================
function buildKeyboard() {
  const wrap = document.getElementById('keyboardWrap');
  wrap.innerHTML = '';

  for (const rowDef of KEY_ROWS) {
    const rowEl = document.createElement('div');
    rowEl.className = 'key-row' + (rowDef.cls ? ' ' + rowDef.cls : '');

    for (const kd of rowDef.keys) {
      // スペーサー
      if (kd.gap) {
        const spacer = document.createElement('div');
        spacer.className = 'key-spacer';
        spacer.style.width = Math.round(kd.u * UNIT + (kd.u - 1) * GAP) + 'px';
        rowEl.appendChild(spacer);
        continue;
      }

      const keyEl = document.createElement('div');
      const pxW = Math.round(kd.u * UNIT + (kd.u - 1) * GAP);
      keyEl.className = 'key';
      keyEl.style.width = pxW + 'px';
      keyEl.dataset.idx = kd.idx;
      if (kd.label) keyEl.dataset.fixedLabel = kd.label;

      // クリックイベント
      keyEl.addEventListener('click', (e) => {
        onKeyClick(kd.idx, e.shiftKey || e.ctrlKey);
      });

      // メインラベルspan
      const mainSpan = document.createElement('span');
      mainSpan.className = 'key-main';
      mainSpan.id = `key-main-${kd.idx}`;
      keyEl.appendChild(mainSpan);

      // サブラベルspan (キーコード名)
      const subSpan = document.createElement('span');
      subSpan.className = 'key-sub';
      subSpan.id = `key-sub-${kd.idx}`;
      keyEl.appendChild(subSpan);
      rowEl.appendChild(keyEl);
    }
    wrap.appendChild(rowEl);
  }
}

// キーボードのキー表示を更新
function renderKeyboard() {
  for (const rowDef of KEY_ROWS) {
    for (const kd of rowDef.keys) {
      if (kd.gap) continue;
      const idx   = kd.idx;
      const kcode = keymapData[currentLayer][idx];
      const keyEl = document.querySelector(`.key[data-idx="${idx}"]`);
      if (!keyEl) continue;

      const mainSpan = document.getElementById(`key-main-${idx}`);
      const subSpan  = document.getElementById(`key-sub-${idx}`);

      // fixedLabel が設定されていれば常にそれを表示
      if (kd.label) {
        mainSpan.textContent = kd.label;
        subSpan.textContent  = kcLabel(kcode);
      } else {
        mainSpan.textContent = kcLabel(kcode);
        subSpan.textContent  = '';
      }

      // クラス
      keyEl.classList.remove('key-no', 'key-trns', 'selected');
      if (kcode === 0x0000) keyEl.classList.add('key-no');
      if (kcode === 0xFFFF) keyEl.classList.add('key-trns');
      if (selectedKeys.includes(idx)) keyEl.classList.add('selected');
    }
  }
  updateSelectionBar();
}

// ===================================================
// 7. キー選択
// ===================================================
function onKeyClick(idx, multi) {
  if (multi) {
    // 複数選択トグル
    const pos = selectedKeys.indexOf(idx);
    if (pos >= 0) {
      selectedKeys.splice(pos, 1);
    } else {
      selectedKeys.push(idx);
    }
  } else {
    if (selectedKeys.length === 1 && selectedKeys[0] === idx) {
      // 同じキーを再クリックで解除
      selectedKeys = [];
    } else {
      selectedKeys = [idx];
    }
  }
  renderKeyboard();
}

function updateSelectionBar() {
  const el = document.getElementById('selectionInfo');

  if (captureMode) {
    el.className = 'selection-capture';
    el.innerHTML = '⌨&nbsp; キーを押して割り当て &nbsp;<span class="capture-hint">（Esc でキャンセル）</span>';
    return;
  }

  if (selectedKeys.length === 0) {
    el.className = 'selection-hint';
    el.textContent = 'キーをクリックして選択し、パレットか直接キー入力で割り当てます（Shift/Ctrlクリックで複数選択）';
  } else if (selectedKeys.length === 1) {
    const idx   = selectedKeys[0];
    const kcode = keymapData[currentLayer][idx];
    el.className = 'selection-active';
    el.innerHTML =
      `選択: Key[${idx}]&ensp;現在 = ${kcName(kcode)} (0x${kcode.toString(16).toUpperCase().padStart(4,'0')})` +
      `&emsp;<button class="btn-capture" onclick="startCapture()">⌨ キー入力</button>`;
  } else {
    el.className = 'selection-active';
    el.innerHTML =
      `${selectedKeys.length} 個のキーを選択中` +
      `&emsp;<button class="btn-capture" onclick="startCapture()">⌨ キー入力</button>`;
  }
}

function startCapture() {
  if (selectedKeys.length === 0) return;
  captureMode = true;
  updateSelectionBar();
}

function stopCapture() {
  captureMode = false;
  updateSelectionBar();
}

// ===================================================
// 8. キーコードパレット
// ===================================================
const PALETTE_CATEGORIES = [
  'special','letters','numbers','fn','mods','edit','nav','symbols','mouse','jp'
];

function switchPaletteTab(cat) {
  currentPaletteCat = cat;
  // タブボタンのアクティブ状態
  document.querySelectorAll('.palette-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  buildPalette(cat);
}

function buildPalette(cat) {
  const container = document.getElementById('paletteKeys');
  container.innerHTML = '';

  for (const [value, info] of KC_MAP.entries()) {
    if (info.category !== cat) continue;
    const btn = document.createElement('button');
    btn.className = 'palette-key';
    btn.textContent = info.label;
    btn.title = `${info.name}  (0x${value.toString(16).toUpperCase().padStart(4,'0')})`;
    btn.addEventListener('click', () => assignKeycode(value));
    container.appendChild(btn);
  }
}

// 選択中のキーにキーコードを割り当て
function assignKeycode(value) {
  if (selectedKeys.length === 0) {
    addLog('warn', 'キーが選択されていません');
    return;
  }
  for (const idx of selectedKeys) {
    keymapData[currentLayer][idx] = value;
  }
  renderKeyboard();
  addLog('info', `[L${currentLayer}] Key[${selectedKeys.join(',')}] ← ${kcName(value)}`);
}

// ===================================================
// 9. レイヤー切替
// ===================================================
function switchLayer(layer) {
  currentLayer = layer;
  document.getElementById('tabLayer0').classList.toggle('active', layer === 0);
  document.getElementById('tabLayer1').classList.toggle('active', layer === 1);
  selectedKeys = [];
  renderKeyboard();
}

function copyLayerTo(src, dst) {
  keymapData[dst] = new Uint16Array(keymapData[src]);
  addLog('info', `Layer ${src} → Layer ${dst} にコピーしました`);
  renderKeyboard();
}

// ===================================================
// 10. 右パネルタブ切替
// ===================================================
function switchRightTab(tab) {
  document.getElementById('rightTabConn').classList.toggle('active',   tab === 'conn');
  document.getElementById('rightTabConfig').classList.toggle('active', tab === 'config');
  document.getElementById('connPanel').style.display   = tab === 'conn'   ? '' : 'none';
  document.getElementById('configPanel').style.display = tab === 'config' ? '' : 'none';
}

// ===================================================
// 11. 接続モード切替
// ===================================================
function onConnModeChange() {
  connMode = document.querySelector('input[name="connMode"]:checked').value;
  document.getElementById('bleConnArea').style.display = connMode === 'ble' ? '' : 'none';
  document.getElementById('usbConnArea').style.display = connMode === 'usb' ? '' : 'none';
}

// ===================================================
// 12. BLE 接続 / 切断
// ===================================================
async function connectBLE() {
  if (!navigator.bluetooth) {
    addLog('error', 'Web Bluetooth API に対応していません（Chrome/Edge を使用してください）');
    return;
  }
  try {
    setConnState('connecting');
    addLog('info', 'Bluetooth デバイスをスキャン中...');

    bleDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'PotaKB' }],
      optionalServices: [BLE_SERVICE_UUID, BLE_BATTERY_SVC],
    });

    bleDevice.addEventListener('gattserverdisconnected', onBLEDisconnected);

    addLog('info', `デバイス発見: ${bleDevice.name}`);
    bleServer = await bleDevice.gatt.connect();

    // PotaKBサービス取得
    const svc = await bleServer.getPrimaryService(BLE_SERVICE_UUID);
    keymapChar = await svc.getCharacteristic(BLE_KEYMAP_UUID);
    configChar = await svc.getCharacteristic(BLE_CONFIG_UUID);

    // バッテリーサービス (オプション)
    try {
      const battSvc = await bleServer.getPrimaryService(BLE_BATTERY_SVC);
      battChar = await battSvc.getCharacteristic(BLE_BATTERY_CHAR);
    } catch (_) {
      battChar = null;
    }

    setConnState('connected');
    addLog('ok', 'Bluetooth 接続完了');
    getBattery();
  } catch (err) {
    setConnState('disconnected');
    addLog('error', `BLE接続エラー: ${err.message}`);
  }
}

function onBLEDisconnected() {
  addLog('warn', 'Bluetooth 接続が切断されました');
  setConnState('disconnected');
  bleServer   = null;
  keymapChar  = null;
  configChar  = null;
  battChar    = null;
}

function onUSBDisconnected(event) {
  if (event.target === usbPort || connMode === 'usb') {
    navigator.serial.removeEventListener('disconnect', onUSBDisconnected);
    usbReadable = null;
    usbWriter   = null;
    usbPort     = null;
    setConnState('disconnected');
    addLog('warn', 'USB接続が切断されました');
  }
}

// ===================================================
// 13. USB Serial 接続 / 切断
// ===================================================
async function connectUSB() {
  if (!navigator.serial) {
    addLog('error', 'Web Serial API に対応していません（Chrome/Edge を使用してください）');
    return;
  }
  try {
    setConnState('connecting');
    addLog('info', 'USB シリアルポートを選択中...');

    usbPort = await navigator.serial.requestPort({
      filters: [{ usbVendorId: 0x239A, usbProductId: 0x8029 }],
    });
    await usbPort.open({ baudRate: 115200 });

    usbReadable = usbPort.readable;
    usbWriter   = usbPort.writable.getWriter();

    navigator.serial.addEventListener('disconnect', onUSBDisconnected);

    setConnState('connected');
    addLog('ok', 'USB Serial 接続完了');
    getBattery();
  } catch (err) {
    setConnState('disconnected');
    addLog('error', `USB接続エラー: ${err.message}`);
  }
}

// ===================================================
// 14. 汎用切断
// ===================================================
async function disconnect() {
  if (connMode === 'ble') {
    if (bleDevice && bleDevice.gatt.connected) {
      bleDevice.gatt.disconnect();
    }
    bleDevice   = null;
    bleServer   = null;
    keymapChar  = null;
    configChar  = null;
    battChar    = null;
  } else {
    try {
      if (usbReader) { await usbReader.cancel(); usbReader = null; }
      if (usbWriter) { usbWriter.releaseLock(); usbWriter = null; }
      if (usbPort)   { await usbPort.close(); usbPort = null; }
    } catch (err) {
      addLog('warn', `切断中にエラー: ${err.message}`);
    }
    usbReadable = null;
  }
  setConnState('disconnected');
  addLog('info', '切断しました');
}

// ===================================================
// 15. 接続状態 UI 更新
// ===================================================
function setConnState(state) {
  connState = state;
  const dot   = document.getElementById('connDot');
  const label = document.getElementById('connLabel');
  const btnDisconnect  = document.getElementById('btnDisconnect');
  const btnBLEConnect  = document.getElementById('btnBLEConnect');
  const btnUSBConnect  = document.getElementById('btnUSBConnect');
  const actionBtns = ['btnLoad','btnSave','btnCalibrate','btnGetBattery'];

  dot.className = 'conn-dot';
  if (state === 'connected') {
    dot.classList.add('connected');
    label.textContent = '接続済み';
    btnDisconnect.style.display = '';
    if (connMode === 'ble') { btnBLEConnect.style.display = 'none'; }
    else                    { btnUSBConnect.style.display = 'none'; }
    actionBtns.forEach(id => document.getElementById(id).disabled = false);
  } else if (state === 'connecting') {
    dot.classList.add('connecting');
    label.textContent = '接続中...';
    btnDisconnect.style.display = 'none';
    actionBtns.forEach(id => document.getElementById(id).disabled = true);
  } else {
    dot.classList.add('disconnected');
    label.textContent = '未接続';
    btnDisconnect.style.display = 'none';
    btnBLEConnect.style.display = '';
    btnUSBConnect.style.display = '';
    actionBtns.forEach(id => document.getElementById(id).disabled = true);
  }
}

// ===================================================
// 16. デバイスから読み込み
// ===================================================
async function loadFromDevice() {
  if (connState !== 'connected') { addLog('warn', '接続されていません'); return; }
  try {
    addLog('info', 'デバイスから読み込み中...');
    if (connMode === 'ble') {
      await bleLoadKeymap();
      await bleLoadConfig();
    } else {
      await usbLoadKeymap();
      await usbLoadConfig();
    }
    addLog('ok', '読み込み完了');
  } catch (err) {
    addLog('error', `読み込みエラー: ${err.message}`);
  }
}

// ===================================================
// 17. デバイスへ保存
// ===================================================
async function saveToDevice() {
  if (connState !== 'connected') { addLog('warn', '接続されていません'); return; }
  try {
    addLog('info', 'デバイスへ保存中...');
    if (connMode === 'ble') {
      await bleSaveKeymap();
      await bleSaveConfig();
    } else {
      await usbSaveKeymap();
      await usbSaveConfig();
    }
    addLog('ok', '保存完了');
  } catch (err) {
    addLog('error', `保存エラー: ${err.message}`);
  }
}

// ===================================================
// 18. キャリブレーション
// ===================================================

// キャリブレーション状態
let calibRunning = false;
let calibCenterX = 512, calibCenterY = 512;
let calibMinX = 512, calibMaxX = 512;
let calibMinY = 512, calibMaxY = 512;
let calibAnimId = null;

function calibrateDevice() {
  if (connState !== 'connected') { addLog('warn', '接続されていません'); return; }

  // フェーズリセット
  document.getElementById('calibPhase1').style.display = '';
  document.getElementById('calibPhase2').style.display = 'none';
  document.getElementById('calibPhase3').style.display = 'none';
  document.getElementById('calibBLEMsg').style.display = 'none';

  if (connMode === 'ble') {
    document.getElementById('calibPhase1').style.display = 'none';
    document.getElementById('calibBLEMsg').style.display = '';
  }

  document.getElementById('calibModal').style.display = '';
}

async function calibRecordCenter() {
  try {
    await usbSendCommand('CALIB_START');
    await usbReadLine(1000);  // "OK"
    await usbSendCommand('READ_STICK');
    const line = await usbReadLine(3000);
    const m = line.match(/STICK:(\d+),(\d+)/);
    if (!m) throw new Error(`応答パースエラー: ${line}`);
    calibCenterX = parseInt(m[1]);
    calibCenterY = parseInt(m[2]);
    calibMinX = calibCenterX; calibMaxX = calibCenterX;
    calibMinY = calibCenterY; calibMaxY = calibCenterY;

    document.getElementById('calibPhase1').style.display = 'none';
    document.getElementById('calibPhase2').style.display = '';
    calibRunning = true;
    calibLoop();
    addLog('info', `センター記録: X=${calibCenterX}, Y=${calibCenterY}`);
  } catch (err) {
    addLog('error', `センター記録エラー: ${err.message}`);
  }
}

async function calibLoop() {
  if (!calibRunning) return;
  try {
    await usbSendCommand('READ_STICK');
    const line = await usbReadLine(1000);
    const m = line.match(/STICK:(\d+),(\d+)/);
    if (m) {
      const x = parseInt(m[1]);
      const y = parseInt(m[2]);
      if (x < calibMinX) calibMinX = x;
      if (x > calibMaxX) calibMaxX = x;
      if (y < calibMinY) calibMinY = y;
      if (y > calibMaxY) calibMaxY = y;
      calibDrawCanvas(x, y);
      document.getElementById('calibInfo').textContent =
        `X: ${x}  (${calibMinX}～${calibMaxX})   Y: ${y}  (${calibMinY}～${calibMaxY})`;
    }
  } catch (_) {}
  if (calibRunning) {
    calibAnimId = setTimeout(calibLoop, 50);
  }
}

function calibDrawCanvas(x, y) {
  const canvas = document.getElementById('calibCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#1e1e2e';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;
  ctx.strokeRect(2, 2, W - 4, H - 4);

  ctx.strokeStyle = '#555';
  ctx.beginPath();
  ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H);
  ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2);
  ctx.stroke();

  // 記録済み範囲ボックス（Y軸反転: キャンバスY=0が上、FWはY値大=上方向）
  const rxL = Math.round((calibMinX / 1023) * W);
  const rxR = Math.round((calibMaxX / 1023) * W);
  const ryT = Math.round(((1023 - calibMaxY) / 1023) * H);
  const ryB = Math.round(((1023 - calibMinY) / 1023) * H);
  ctx.strokeStyle = '#a6e3a1';
  ctx.lineWidth = 1;
  ctx.strokeRect(rxL, ryT, rxR - rxL, ryB - ryT);

  // 現在位置（Y軸反転）
  const px = Math.round((x / 1023) * W);
  const py = Math.round(((1023 - y) / 1023) * H);
  ctx.fillStyle = '#89b4fa';
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();
}

function calibFinish() {
  calibRunning = false;
  if (calibAnimId) { clearTimeout(calibAnimId); calibAnimId = null; }

  const rangeX = Math.max(calibMaxX - calibCenterX, calibCenterX - calibMinX);
  const rangeY = Math.max(calibMaxY - calibCenterY, calibCenterY - calibMinY);

  document.getElementById('calibResX').textContent  = calibCenterX;
  document.getElementById('calibResY').textContent  = calibCenterY;
  document.getElementById('calibResRX').textContent = rangeX;
  document.getElementById('calibResRY').textContent = rangeY;

  document.getElementById('calibPhase2').style.display = 'none';
  document.getElementById('calibPhase3').style.display = '';
}

async function calibApply() {
  const rangeX = Math.max(calibMaxX - calibCenterX, calibCenterX - calibMinX);
  const rangeY = Math.max(calibMaxY - calibCenterY, calibCenterY - calibMinY);

  config.stick_center_x = calibCenterX;
  config.stick_center_y = calibCenterY;
  config.stick_range_x  = Math.max(rangeX, 50);
  config.stick_range_y  = Math.max(rangeY, 50);

  syncConfigToForm();

  try {
    // スティック処理を再開してから設定だけ保存（キーマップは触らない）
    await usbSendCommand('CALIB_END');
    await usbReadLine(1000);  // "OK"
    await usbSaveConfig();
    addLog('ok', `キャリブレーション適用: CX=${calibCenterX}, CY=${calibCenterY}, RX=${rangeX}, RY=${rangeY}`);
  } catch (err) {
    addLog('error', `保存エラー: ${err.message}`);
  }

  document.getElementById('calibModal').style.display = 'none';
}

function calibCancel() {
  calibRunning = false;
  if (calibAnimId) { clearTimeout(calibAnimId); calibAnimId = null; }
  document.getElementById('calibModal').style.display = 'none';
  // スティック処理を再開（キャリブ中断時）
  if (connState === 'connected' && connMode === 'usb') {
    usbSendCommand('CALIB_END').catch(() => {});
  }
}

function calibOverlayClick(event) {
  if (event.target === document.getElementById('calibModal')) {
    calibCancel();
  }
}

// ===================================================
// 19. バッテリー取得
// ===================================================
async function getBattery() {
  if (connState !== 'connected') { addLog('warn', '接続されていません'); return; }
  try {
    let pct = null;
    if (connMode === 'ble') {
      if (!battChar) { addLog('warn', 'バッテリーキャラクタリスティクスが見つかりません'); return; }
      const val = await battChar.readValue();
      pct = val.getUint8(0);
    } else {
      await usbSendCommand('GET_BATTERY');
      const line = await usbReadLine(3000);
      const m = line.match(/BATTERY:(\d+)/);
      if (m) pct = parseInt(m[1]);
    }
    if (pct !== null) {
      document.getElementById('batteryValue').textContent = `${pct}%`;
      addLog('ok', `バッテリー: ${pct}%`);
    }
  } catch (err) {
    addLog('error', `バッテリー取得エラー: ${err.message}`);
  }
}

// ===================================================
// 20. BLE キーマップ読み書き
// ===================================================
async function bleLoadKeymap() {
  // 260バイト = 2レイヤー × 65キー × 2バイト
  const val = await keymapChar.readValue();
  if (val.byteLength < 260) throw new Error(`keymapデータ長不正: ${val.byteLength} bytes`);
  parseKeymapBinary(val.buffer);
  renderKeyboard();
  addLog('info', `キーマップ読み込み: ${val.byteLength} bytes`);
}

async function bleSaveKeymap() {
  const buf = buildKeymapBinary();
  // 128バイトずつチャンクに分割して送信
  const CHUNK = 128;
  for (let offset = 0; offset < buf.byteLength; offset += CHUNK) {
    const chunk = buf.slice(offset, Math.min(offset + CHUNK, buf.byteLength));
    await keymapChar.writeValueWithoutResponse(chunk);
    // 少し待機してFW側の処理を待つ
    await sleep(20);
  }
  addLog('info', `キーマップ保存: ${buf.byteLength} bytes (チャンク送信)`);
}

// ===================================================
// 21. BLE コンフィグ読み書き
// ===================================================
async function bleLoadConfig() {
  const val = await configChar.readValue();
  if (val.byteLength < 34) throw new Error(`configデータ長不正: ${val.byteLength} bytes`);
  parseConfigBinary(val.buffer);
  syncConfigToForm();
  addLog('info', `設定読み込み: ${val.byteLength} bytes`);
}

async function bleSaveConfig() {
  const buf = buildConfigBinary();
  await configChar.writeValueWithoutResponse(buf);
  addLog('info', `設定保存: ${buf.byteLength} bytes`);
}

// ===================================================
// 22. USB Serial コマンド送受信ユーティリティ
// ===================================================
async function usbSendCommand(cmd) {
  if (!usbWriter) throw new Error('USB ライターが初期化されていません');
  const encoder = new TextEncoder();
  await usbWriter.write(encoder.encode(cmd + '\n'));
}

// 指定タイムアウトで1行読み取る
async function usbReadLine(timeoutMs) {
  if (!usbReadable) throw new Error('USB リーダブルが初期化されていません');
  const reader = usbReadable.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  const deadline = Date.now() + timeoutMs;
  try {
    while (Date.now() < deadline) {
      const remaining = deadline - Date.now();
      const { value, done } = await Promise.race([
        reader.read(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('タイムアウト')), remaining)),
      ]);
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const nl = buf.indexOf('\n');
      if (nl >= 0) {
        const line = buf.slice(0, nl).trim();
        return line;
      }
    }
    throw new Error('タイムアウト: レスポンスなし');
  } finally {
    reader.releaseLock();
  }
}

// 指定バイト数だけ読み取る (タイムアウト付き)
async function usbReadBytes(length, timeoutMs) {
  if (!usbReadable) throw new Error('USB リーダブルが初期化されていません');
  const reader = usbReadable.getReader();
  const result = new Uint8Array(length);
  let received = 0;
  const deadline = Date.now() + timeoutMs;
  try {
    while (received < length && Date.now() < deadline) {
      const remaining = deadline - Date.now();
      const { value, done } = await Promise.race([
        reader.read(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('タイムアウト')), remaining)),
      ]);
      if (done) break;
      for (let i = 0; i < value.length && received < length; i++) {
        result[received++] = value[i];
      }
    }
    if (received < length) throw new Error(`データ不足: ${received}/${length} bytes`);
    return result.buffer;
  } finally {
    reader.releaseLock();
  }
}

// ===================================================
// 23. USB Serial キーマップ読み書き
// ===================================================
async function usbLoadKeymap() {
  await usbSendCommand('READ_KEYMAP');
  await sleep(200);
  const buf = await usbReadBytes(260, 3000);
  parseKeymapBinary(buf);
  renderKeyboard();
  addLog('info', 'USB: キーマップ読み込み完了 (260 bytes)');
}

async function usbSaveKeymap() {
  await usbSendCommand('WRITE_KEYMAP');
  await sleep(50);
  const buf = buildKeymapBinary();
  if (!usbWriter) throw new Error('USB ライターが初期化されていません');
  await usbWriter.write(new Uint8Array(buf));
  const resp = await usbReadLine(3000);
  if (!resp.includes('OK')) throw new Error(`予期しないレスポンス: ${resp}`);
  addLog('info', 'USB: キーマップ保存完了');
}

// ===================================================
// 24. USB Serial コンフィグ読み書き
// ===================================================
async function usbLoadConfig() {
  await usbSendCommand('READ_CONFIG');
  await sleep(200);
  const buf = await usbReadBytes(35, 3000);
  parseConfigBinary(buf);
  syncConfigToForm();
  addLog('info', 'USB: 設定読み込み完了 (35 bytes)');
}

async function usbSaveConfig() {
  await usbSendCommand('WRITE_CONFIG');
  await sleep(50);
  const buf = buildConfigBinary();
  if (!usbWriter) throw new Error('USB ライターが初期化されていません');
  await usbWriter.write(new Uint8Array(buf));
  const resp = await usbReadLine(3000);
  if (!resp.includes('OK')) throw new Error(`予期しないレスポンス: ${resp}`);
  addLog('info', 'USB: 設定保存完了');
}

// ===================================================
// 25. キーマップバイナリ変換
// ===================================================
// ArrayBuffer → keymapData へ変換 (260バイト)
function parseKeymapBinary(buf) {
  const view = new DataView(buf);
  for (let layer = 0; layer < NUM_LAYERS; layer++) {
    for (let k = 0; k < NUM_KEYS; k++) {
      const offset = (layer * NUM_KEYS + k) * 2;
      keymapData[layer][k] = view.getUint16(offset, true); // LE
    }
  }
}

// keymapData → ArrayBuffer (260バイト)
function buildKeymapBinary() {
  const buf  = new ArrayBuffer(NUM_LAYERS * NUM_KEYS * 2);
  const view = new DataView(buf);
  for (let layer = 0; layer < NUM_LAYERS; layer++) {
    for (let k = 0; k < NUM_KEYS; k++) {
      const offset = (layer * NUM_KEYS + k) * 2;
      view.setUint16(offset, keymapData[layer][k], true); // LE
    }
  }
  return buf;
}

// ===================================================
// 26. コンフィグバイナリ変換
// ===================================================
// Config構造体 (packed, 35バイト) v3
// Offset 0:  uint8_t  version
// Offset 1:  uint16_t stick_center_x   LE
// Offset 3:  uint16_t stick_center_y   LE
// Offset 5:  uint16_t stick_deadzone   LE
// Offset 7:  uint16_t stick_range_x    LE
// Offset 9:  uint16_t stick_range_y    LE
// Offset 11: float32  stick_ema_alpha  LE
// Offset 15: float32  mouse_max_speed  LE
// Offset 19: float32  scroll_max_speed LE
// Offset 23: uint32_t sleep_timeout_ms LE
// Offset 27: uint8_t  led_brightness
// Offset 28: uint16_t blink_interval_ms LE
// Offset 30: uint8_t  scroll_invert  (0=通常, 1=反転)
// Offset 31: uint32_t magic LE  = 0x504F5441
// Total: 35 bytes

function parseConfigBinary(buf) {
  const view = new DataView(buf instanceof ArrayBuffer ? buf : buf.buffer);
  config.version          = view.getUint8(0);
  config.stick_center_x   = view.getUint16(1,  true);
  config.stick_center_y   = view.getUint16(3,  true);
  config.stick_deadzone   = view.getUint16(5,  true);
  config.stick_range_x    = view.getUint16(7,  true);
  config.stick_range_y    = view.getUint16(9,  true);
  config.stick_ema_alpha  = view.getFloat32(11,true);
  config.mouse_max_speed  = view.getFloat32(15,true);
  config.scroll_max_speed = view.getFloat32(19,true);
  config.sleep_timeout_ms = view.getUint32(23, true);
  config.led_brightness   = view.getUint8(27);
  config.blink_interval_ms= view.getUint16(28, true);
  config.scroll_invert    = view.getUint8(30);
  config.magic            = view.getUint32(31, true);
}

function buildConfigBinary() {
  const buf  = new ArrayBuffer(35);
  const view = new DataView(buf);
  view.setUint8(0,   config.version);
  view.setUint16(1,  config.stick_center_x,   true);
  view.setUint16(3,  config.stick_center_y,   true);
  view.setUint16(5,  config.stick_deadzone,   true);
  view.setUint16(7,  config.stick_range_x,    true);
  view.setUint16(9,  config.stick_range_y,    true);
  view.setFloat32(11,config.stick_ema_alpha,  true);
  view.setFloat32(15,config.mouse_max_speed,  true);
  view.setFloat32(19,config.scroll_max_speed, true);
  view.setUint32(23, config.sleep_timeout_ms, true);
  view.setUint8(27,  config.led_brightness);
  view.setUint16(28, config.blink_interval_ms,true);
  view.setUint8(30,  config.scroll_invert ? 1 : 0);
  view.setUint32(31, 0x504F5441,              true); // magic "POTA"
  return buf;
}

// ===================================================
// 27. 設定フォームとConfigの双方向バインド
// ===================================================
// Config → フォームへ同期
function syncConfigToForm() {
  // スライダーとバッジ (sliderFn: config値→スライダー整数, hintFn: config値→表示文字列)
  setSlider('cfgCenterX',      'hintCenterX',      config.stick_center_x,    v=>Math.round(v),       v=>String(Math.round(v)));
  setSlider('cfgCenterY',      'hintCenterY',      config.stick_center_y,    v=>Math.round(v),       v=>String(Math.round(v)));
  setSlider('cfgDeadzone',     'hintDeadzone',     config.stick_deadzone,    v=>Math.round(v),       v=>String(Math.round(v)));
  setSlider('cfgRangeX',       'hintRangeX',       config.stick_range_x,     v=>Math.round(v),       v=>String(Math.round(v)));
  setSlider('cfgRangeY',       'hintRangeY',       config.stick_range_y,     v=>Math.round(v),       v=>String(Math.round(v)));
  setSlider('cfgEmaAlpha',     'hintEmaAlpha',     config.stick_ema_alpha,   v=>Math.round(v*100),   v=>v.toFixed(2));
  setSlider('cfgMouseSpeed',   'hintMouseSpeed',   config.mouse_max_speed,   v=>Math.round(v*100),   v=>v.toFixed(2));
  setSlider('cfgScrollSpeed',  'hintScrollSpeed',  config.scroll_max_speed,  v=>Math.round(v*100),   v=>v.toFixed(2));
  setSlider('cfgSleepTimeout', 'hintSleepTimeout', config.sleep_timeout_ms,  v=>Math.round(v/1000),  v=>String(Math.round(v/1000)));
  setSlider('cfgLedBrightness','hintLedBrightness',config.led_brightness,    v=>Math.round(v),       v=>String(Math.round(v)));
  setSlider('cfgBlinkInterval','hintBlinkInterval',config.blink_interval_ms, v=>Math.round(v),       v=>String(Math.round(v)));

  // チェックボックス
  const scrollInvertEl = document.getElementById('cfgScrollInvert');
  if (scrollInvertEl) scrollInvertEl.checked = !!config.scroll_invert;

  // 数値入力フィールド
  setNum('cfgCenterXNum',      config.stick_center_x,    0);
  setNum('cfgCenterYNum',      config.stick_center_y,    0);
  setNum('cfgDeadzoneNum',     config.stick_deadzone,    0);
  setNum('cfgRangeXNum',       config.stick_range_x,     0);
  setNum('cfgRangeYNum',       config.stick_range_y,     0);
  setNum('cfgEmaAlphaNum',     config.stick_ema_alpha,   2);
  setNum('cfgMouseSpeedNum',   config.mouse_max_speed,   2);
  setNum('cfgScrollSpeedNum',  config.scroll_max_speed,  2);
  setNum('cfgSleepTimeoutNum', config.sleep_timeout_ms / 1000, 0);
  setNum('cfgLedBrightnessNum',config.led_brightness,   0);
  setNum('cfgBlinkIntervalNum',config.blink_interval_ms,0);
}

// setSlider: config値をスライダーとヒントバッジに反映する
// sliderId: スライダー要素ID
// hintId:   バッジ要素ID
// value:    実際のconfig値
// sliderFn: config値 → スライダー整数値 への変換関数
// hintFn:   config値 → 表示文字列 への変換関数
function setSlider(sliderId, hintId, value, sliderFn, hintFn) {
  const slider = document.getElementById(sliderId);
  const hint   = document.getElementById(hintId);
  if (!slider || !hint) return;
  slider.value = sliderFn(value);
  hint.textContent = hintFn(value);
}

function setNum(id, value, decimals) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = decimals ? value.toFixed(decimals) : Math.round(value);
}

// スライダー変更時 (HTMLから呼ばれる)
// key: config のプロパティ名
// rawValue: スライダーで計算済みの実際のconfig値
// hintId: バッジのID
// fmtFn: バッジの表示フォーマット関数
// numId: 数値入力フィールドのID
function onRangeInput(key, rawValue, hintId, fmtFn, numId) {
  config[key] = rawValue;
  const hint = document.getElementById(hintId);
  if (hint) hint.textContent = fmtFn(rawValue);
  // 数値入力フィールドも同期
  const numEl = document.getElementById(numId);
  if (numEl) {
    // sleep_timeout_ms は秒単位で表示
    if (key === 'sleep_timeout_ms') {
      numEl.value = Math.round(rawValue / 1000);
    } else if (typeof rawValue === 'number' && !Number.isInteger(rawValue)) {
      numEl.value = rawValue.toFixed(2);
    } else {
      numEl.value = Math.round(rawValue);
    }
  }
}

// 数値入力フィールド変更時 (HTMLから呼ばれる)
// scale: スライダー値 = config値 × scale
// isFloat: floatか
function onNumInput(key, numId, sliderId, hintId, scale, isFloat) {
  const numEl   = document.getElementById(numId);
  const slider  = document.getElementById(sliderId);
  const hint    = document.getElementById(hintId);
  if (!numEl) return;
  let val = parseFloat(numEl.value);
  if (isNaN(val)) return;
  // sleep_timeout_ms: UIは秒単位で入力、configはms単位で保持
  if (key === 'sleep_timeout_ms') {
    config[key] = Math.round(val) * 1000;
    if (slider) slider.value = Math.round(val);
    if (hint)   hint.textContent = String(Math.round(val));
  } else {
    config[key] = val;
    if (slider) slider.value = Math.round(val * scale);
    if (hint)   hint.textContent = isFloat ? val.toFixed(2) : String(Math.round(val));
  }
}

function resetConfigToDefault() {
  config = getDefaultConfig();
  syncConfigToForm();
  addLog('info', '設定をデフォルト値に戻しました');
}

// ===================================================
// 28. ファイルエクスポート / インポート
// ===================================================
function exportToFile() {
  const data = {
    version: 2,
    keymap: [
      Array.from(keymapData[0]),
      Array.from(keymapData[1]),
    ],
    config: { ...config },
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'potakb_config.json';
  a.click();
  URL.revokeObjectURL(url);
  addLog('ok', 'JSON エクスポート完了');
}

function importFromFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.keymap || !data.config) throw new Error('無効なフォーマット');
      keymapData[0] = new Uint16Array(data.keymap[0]);
      keymapData[1] = new Uint16Array(data.keymap[1]);
      config = { ...getDefaultConfig(), ...data.config };
      renderKeyboard();
      syncConfigToForm();
      addLog('ok', `JSON インポート完了: ${file.name}`);
    } catch (err) {
      addLog('error', `インポートエラー: ${err.message}`);
    }
  };
  reader.readAsText(file);
  // 同じファイルを再インポートできるようにリセット
  event.target.value = '';
}

// ===================================================
// 29. ログ
// ===================================================
const MAX_LOG_ENTRIES = 50;
let logEntries = [];

function addLog(type, msg) {
  const now  = new Date();
  const time = now.toTimeString().slice(0, 8);
  logEntries.push({ type, time, msg });
  if (logEntries.length > MAX_LOG_ENTRIES) logEntries.shift();
  renderLog();
}

function renderLog() {
  const container = document.getElementById('logContent');
  container.innerHTML = '';
  for (const entry of logEntries) {
    const div  = document.createElement('div');
    div.className = `log-entry log-${entry.type}`;
    const ts   = document.createElement('span');
    ts.className = 'log-time';
    ts.textContent = entry.time;
    const msg  = document.createElement('span');
    msg.className = 'log-msg';
    msg.textContent = entry.msg;
    div.appendChild(ts);
    div.appendChild(msg);
    container.appendChild(div);
  }
  // 最新行にスクロール
  container.scrollTop = container.scrollHeight;
}

function clearLog() {
  logEntries = [];
  renderLog();
}

// ===================================================
// 30. ユーティリティ
// ===================================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===================================================
// キャプチャモード: keydownハンドラ
// ===================================================
document.addEventListener('keydown', (e) => {
  if (!captureMode) return;
  e.preventDefault();

  if (e.code === 'Escape') {
    stopCapture();
    addLog('info', 'キャプチャキャンセル');
    return;
  }

  const hid = EVENT_CODE_TO_HID[e.code];
  if (hid === undefined) {
    addLog('warn', `未対応のキー: ${e.code}`);
    return;
  }

  assignKeycode(hid);
  stopCapture();
});
