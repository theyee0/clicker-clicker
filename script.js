const frames = [];

const createShopItems = (frame) => {
    const shopPanel = frame.shopPanel;
    const shopItems = frame.shopItems;

    shopItems.forEach((item) => {
        const buyButton = document.createElement("button");
        const shopItem = document.createElement("div");
        shopItem.className = "shop-item";
        shopItem.innerHTML = `
<div>
<h3>${item.name}</h3>
<p>${item.description}</p>
</div>
`;
        buyButton.innerHTML = `Buy ${item.cost}`;
        buyButton.onclick = () => buyItem(frame, `${item.name}`);
        shopItem.appendChild(buyButton);
        shopPanel.appendChild(shopItem);
    });
}

const buyItem = (frame, itemName) => {
    console.log(frame);
    let item = frame.shopItems.find((i) => i.name === itemName);

    if (frame.clickCount >= item.cost) {
        processClicks(frame, -item.cost);

        const itemInArray = frame.statsItems.find((obj) => obj.name === itemName);

        itemInArray.amount++;
        itemInArray.itemBox.textContent = itemInArray.amount;

        item.cost *= 2;

        itemInArray.itemBox.innerText = item.cost;
    }
}

const processClicks = (frame, count) => {
    const clickNum = frame.statsItems.find((i) => (i.name === "clickNum"));

    clickNum.count += count;
    clickNum.itemBox.innerText = clickNum.count;
    frame.clickCount = clickNum.count;
}

const buildFrame = (parentFrame) => {
    const statsPanel = document.createElement("aside");
    const gameArea = document.createElement("section");
    const shopPanel = document.createElement("aside");
    const button = document.createElement("button");
    const child = document.createElement("section");

    parentFrame.appendChild(statsPanel);
    parentFrame.appendChild(gameArea);
    parentFrame.appendChild(shopPanel);

    const frame = {
        clickCount: 0,
        statsItems: [],
        gameArea: gameArea,
        shopPanel: shopPanel,
        child: child,
        shopItems: [
            {
                name: "Alibaba Autoclicker",
                description: "Clicks for you, but not very well...",
                cost: 10,
            },
            {
                name: "Strong Finger",
                description: "Click so hard, you get more clicks per click",
                cost: 10,
            },
        ],
   };

    const score = document.createElement("div");
    const scoreText = document.createElement("p");
    score.className = "stats-item";
    score.innerHTML = `
<div>
<h3>Number of clicks</h3>
</div>`;
    score.appendChild(scoreText);
    statsPanel.appendChild(score);
    frame.statsItems.push({
        name: "clickNum",
        count: 0,
        itemBox: scoreText,
    });

    frame.shopItems.forEach((item) => {
        const numBox = document.createElement("p");
        const shopItem = document.createElement("div");
        shopItem.className = "stats-item";
        shopItem.innerHTML = `
<div>
<h3>${item.name}</h3>
</div>
`;
        shopItem.appendChild(numBox);
        statsPanel.appendChild(shopItem);
        frame.statsItems.push({
            name: item.name,
            count: 0,
            itemBox: numBox,
        });
        numBox.innerText = "0";
    });

    button.id = "clicker-button";
    button.innerHTML = "<img src=\"https://cdn.creazilla.com/cliparts/3224900/mouse-clipart-md.png\" />";
    button.onclick = () => processClicks(frame, 1);

    child.className = "frame";

    gameArea.appendChild(child);
    gameArea.appendChild(button);

    shopPanel.className = "shop-panel";
    createShopItems(frame);

    return frame;
}

frames.push(buildFrame(document.getElementsByClassName("frame")[0]));

setInterval(() => {
    let clickRate = 0;
    for (let i = 0; i < frames.length; i++) {
        clickRate *= frames[i].statsItems.find((i) => i.name === "Strong Finger").count;
        clickRate += frames[i].statsItems.find((i) => i.name === "Alibaba Autoclicker").count;

        processClicks(frames[i], clickRate);
    }
});
