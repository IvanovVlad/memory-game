const tileHiddenCss = "tile-hidden",
  tileCorrectCss = "tile-correct",
  tileIncorrectCss = "tile-incorrect";
let rootElement,
  scoreContainer,
  stepCounterContainer,
  newGameTrigger,
  scoreboardTrigger,
  scoreboardModal;

const sleep = (time) => new Promise((r) => setTimeout(r, time));

const useAssetImage = () => {
  const imgSrc = "/memory-game/preset_cats.jpg";
  const scale = 0.5;
  const imgWidth = 1280 * scale;
  const imgHeight = 632 * scale;
  const tileSize = 300 * scale;
  const tileInitialOffsetX = -10 * scale;
  const tileInitialOffsetY = -10 * scale;
  const tileOffsetX = -320 * scale;
  const tileOffsetY = -320 * scale;
  const total = 8;

  const assets = [
    {
      breed: "persian",
      offset: {
        x: tileInitialOffsetX,
        y: tileInitialOffsetY,
      },
    },
    {
      breed: "siamese",
      offset: {
        x: tileInitialOffsetX + tileOffsetX,
        y: tileInitialOffsetY,
      },
    },
    {
      breed: "maine coon",
      offset: {
        x: tileInitialOffsetX + tileOffsetX * 2,
        y: tileInitialOffsetY,
      },
    },
    {
      breed: "sphynx",
      offset: {
        x: tileInitialOffsetX + tileOffsetX * 3,
        y: tileInitialOffsetY,
      },
    },
    {
      breed: "scottish fold",
      offset: {
        x: tileInitialOffsetX,
        y: tileInitialOffsetY + tileOffsetY,
      },
    },
    {
      breed: "bengal",
      offset: {
        x: tileInitialOffsetX + tileOffsetX,
        y: tileInitialOffsetY + tileOffsetY,
      },
    },
    {
      breed: "black bombay",
      offset: {
        x: tileInitialOffsetX + tileOffsetX * 2,
        y: tileInitialOffsetY + tileOffsetY,
      },
    },
    {
      breed: "calico",
      offset: {
        x: tileInitialOffsetX + tileOffsetX * 3,
        y: tileInitialOffsetY + tileOffsetY,
      },
    },
  ];

  const getTileImg = (index) => {
    const asset = assets[index];
    const tile = document.createElement("button");
    tile.id = asset.breed;
    tile.alt = asset.breed;
    tile.setAttribute(
      "style",
      `
        width: ${tileSize}px;
        height: ${tileSize}px;
        background: url('${imgSrc}') ${asset.offset.x}px ${asset.offset.y}px / ${imgWidth}px ${imgHeight}px no-repeat;
      `,
    );
    tile.classList.add("tile");
    return tile;
  };

  return { getTileImg, total, tileSize };
};

const useScore = (maxScore) => {
  let score = 0;

  const updateScore = () => {
    scoreContainer.textContent = `${score} / ${maxScore}`;
  };

  updateScore();

  const increase = () => {
    score += 1;
    updateScore();
  };

  const getScore = () => score;

  return { getScore, increase };
};

const useStepCounter = () => {
  let count = 0;

  const updateSteps = () => {
    stepCounterContainer.textContent = count;
  };

  updateSteps();

  const increase = () => {
    count += 1;
    updateSteps();
  };

  const getCount = () => count;

  return { increase, getCount };
};

const useScoreboard = (maxCount) => {
  const persistKey = "scoreboard";

  const obtain = () => JSON.parse(window.localStorage.getItem(persistKey) || "[]");

  const persist = (scores) => {
    scores.sort((a, b) => Number(a.steps) - Number(b.steps)).slice(0, maxCount);
    window.localStorage.setItem(persistKey, JSON.stringify(scores));
  };

  const pushScore = (steps) => {
    const scores = obtain();
    scores.push({ steps, date: new Date() });
    persist(scores);
  };

  const reset = () => {
    window.localStorage.setItem(persistKey, "[]");
  };

  const hideModal = () => {
    scoreboardModal.replaceChildren();
  };

  const showModal = (yourScore, restart) => {
    const scores = obtain();

    const modal = document.createElement("div");
    modal.className = "scoreboard-modal";

    const wrapper = document.createElement("div");
    wrapper.className = "scoreboard-wrapper";
    modal.appendChild(wrapper);

    const content = document.createElement("div");
    content.className = "scoreboard-content";
    wrapper.appendChild(content);

    const xButton = document.createElement("button");
    xButton.className = "scoreboard-x";
    content.appendChild(xButton);

    const body = document.createElement("div");
    content.appendChild(body);

    const scoresBlock = document.createElement("div");
    body.appendChild(scoresBlock);

    const title = document.createElement("div");
    title.textContent = "Таблица результатов";
    scoresBlock.appendChild(title);

    const scoresView = document.createElement("div");
    scoresBlock.appendChild(scoresView);

    if (scores.length) {
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      for (const text of ["Место", "Счёт", "Дата"]) {
        const th = document.createElement("th");
        th.textContent = text;
        headRow.appendChild(th);
      }
      thead.appendChild(headRow);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      scores.forEach((s, i) => {
        const row = document.createElement("tr");
        for (const text of [i + 1, s.steps, s.date]) {
          const td = document.createElement("td");
          td.textContent = text;
          row.appendChild(td);
        }
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      scoresView.appendChild(table);
    } else {
      scoresView.textContent = "Нет попыток";
    }

    const yourScoreView = document.createElement("div");
    if (yourScore !== undefined) {
      yourScoreView.textContent = `Ваш счёт: ${yourScore}`;
    }
    body.appendChild(yourScoreView);

    const actions = document.createElement("div");
    content.appendChild(actions);

    if (yourScore !== undefined) {
      const restartButton = document.createElement("button");
      restartButton.className = "scoreboard-restart";
      restartButton.textContent = "Новая игра";
      actions.appendChild(restartButton);
    }

    const closeButton = document.createElement("button");
    closeButton.className = "scoreboard-close";
    closeButton.textContent = "Закрыть";
    actions.appendChild(closeButton);

    scoreboardModal.replaceChildren(modal);
    modal.addEventListener("mousedown", (e) => {
      const classes = e.target.classList;
      if (
        classes.contains("scoreboard-modal") ||
        classes.contains("scoreboard-x") ||
        classes.contains("scoreboard-close")
      ) {
        hideModal();
      }

      if (classes.contains("scoreboard-restart")) {
        restart();
        hideModal();
      }
    });
  };

  return { pushScore, reset, obtain, showModal };
};

const useGameMaster = () => {
  const assetImage = useAssetImage();
  const scoreboard = useScoreboard(10);
  const maxScore = assetImage.total;
  let score = useScore(maxScore);
  let stepCounter = useStepCounter();
  let tiles = [];
  let solvedIds = [];
  let tmpRevealElement;
  let idle = false;

  const updateTileHash = (tile) => {
    tile.setAttribute("hash", crypto.randomUUID());
  };

  const revealTile = (tile) => {
    tile.classList.remove(tileHiddenCss);
    tile.setAttribute("revealed", "");
  };

  const sealTile = (tile) => {
    if (solvedIds.includes(tile.id)) {
      return;
    }
    tile.classList.add(tileHiddenCss);
    tile.removeAttribute("revealed");
  };

  const makeMove = async (tile) => {
    if (
      idle ||
      solvedIds.includes(tile.id) ||
      (tmpRevealElement && tmpRevealElement.getAttribute("hash") === tile.getAttribute("hash"))
    ) {
      return;
    }

    idle = true;

    if (!tmpRevealElement) {
      tmpRevealElement = tile;
      revealTile(tile);
      idle = false;
      return;
    }

    revealTile(tile);
    stepCounter.increase();

    if (tmpRevealElement.id === tile.id) {
      tmpRevealElement.classList.add(tileCorrectCss);
      tile.classList.add(tileCorrectCss);

      solvedIds.push(tmpRevealElement.id);
      tmpRevealElement = undefined;
      idle = false;
      score.increase();

      if (solvedIds.length === maxScore) {
        scoreboard.pushScore(stepCounter.getCount());
        scoreboard.showModal(stepCounter.getCount(), startGame);
      }

      return;
    }

    tmpRevealElement.classList.add(tileIncorrectCss);
    tile.classList.add(tileIncorrectCss);

    await sleep(1000);

    tmpRevealElement.classList.remove(tileIncorrectCss);
    tile.classList.remove(tileIncorrectCss);

    sealTile(tmpRevealElement);
    sealTile(tile);
    tmpRevealElement = undefined;
    idle = false;
  };

  const shuffleCards = () => {
    tiles = [];
    for (let i = 0; i < assetImage.total * 2; i++) {
      const ii = i >= assetImage.total ? i - assetImage.total : i;
      const tile = assetImage.getTileImg(ii);
      tile.addEventListener("click", (e) => makeMove(e.target));
      tile.classList.add(tileHiddenCss);
      updateTileHash(tile);
      tiles.push(tile);
    }
    tiles.sort((a, b) => (a.getAttribute("hash") > b.getAttribute("hash") ? 1 : -1));
  };

  const reset = () => {
    rootElement.replaceChildren();
    solvedIds = [];
    tiles = [];
    score = useScore(maxScore);
    stepCounter = useStepCounter();
  };

  const startGame = () => {
    reset();
    shuffleCards();
    rootElement.setAttribute(
      "style",
      `display: grid; grid-template: repeat(4, ${assetImage.tileSize}px) / repeat(4, ${assetImage.tileSize}px); grid-gap: 16px; width: fit-content;`,
    );

    for (const tile of tiles) {
      rootElement.appendChild(tile);
    }
  };

  const showScoreboard = () => {
    if (score !== maxScore) {
      scoreboard.showModal(undefined, startGame);
    } else {
      scoreboard.showModal(stepCounter.getCount(), startGame);
    }
  };

  return {
    startGame,
    showScoreboard,
  };
};

let gm;

(() => {
  const gameContainer = document.createElement("div");
  gameContainer.className = "game-container";
  document.body.appendChild(gameContainer);

  const header = document.createElement("header");
  gameContainer.appendChild(header);

  const controlsOuter = document.createElement("div");
  header.appendChild(controlsOuter);

  const controls = document.createElement("div");
  controlsOuter.appendChild(controls);

  newGameTrigger = document.createElement("button");
  newGameTrigger.id = "new-game";
  newGameTrigger.textContent = "Новая игра";
  controls.appendChild(newGameTrigger);

  scoreboardTrigger = document.createElement("button");
  scoreboardTrigger.id = "scoreboard-trigger";
  scoreboardTrigger.textContent = "Таблица лидеров";
  controls.appendChild(scoreboardTrigger);

  const stats = document.createElement("div");
  header.appendChild(stats);

  const stepsBlock = document.createElement("div");
  stats.appendChild(stepsBlock);

  const stepsLabel = document.createElement("div");
  stepsLabel.textContent = "Шагов:";
  stepsBlock.appendChild(stepsLabel);

  stepCounterContainer = document.createElement("div");
  stepCounterContainer.id = "step-view";
  stepsBlock.appendChild(stepCounterContainer);

  const scoreBlock = document.createElement("div");
  stats.appendChild(scoreBlock);

  const scoreLabel = document.createElement("div");
  scoreLabel.textContent = "Счёт";
  scoreBlock.appendChild(scoreLabel);

  scoreContainer = document.createElement("div");
  scoreContainer.id = "score-view";
  scoreBlock.appendChild(scoreContainer);

  rootElement = document.createElement("div");
  rootElement.id = "game-box";
  gameContainer.appendChild(rootElement);

  scoreboardModal = document.createElement("div");
  scoreboardModal.id = "scoreboard-modal";
  gameContainer.appendChild(scoreboardModal);

  gm = useGameMaster();
  gm.startGame();

  scoreboardTrigger.addEventListener("click", gm.showScoreboard);
  newGameTrigger.addEventListener("click", gm.startGame);
})();
