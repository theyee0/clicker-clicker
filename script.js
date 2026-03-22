const frames = [];

class StatsItem {
    #html;
    #name;
    #valueDisplay;
    #value;

    constructor(scale, name, value) {
        this.#html = document.createElement("div");
        this.#html.className = "stats-item"
        this.#html.innerHTML = `<div><h3>${name}</h3></div>`;
        this.#html.style.width = `#{scale * 150}px`;

        this.#name = name;

        this.#valueDisplay = document.createElement("p");
        this.value = value;
        this.#html.append(this.#valueDisplay);
    }

    get HTMLObj() {
        return this.#html;
    }

    get name() {
        return this.#name;
    }

    get value() {
        return this.#value;
    }

    set value(x) {
        this.#value = x;
        this.#valueDisplay.innerText = x;
    }

    incrementValue(x) {
        this.value = this.#value + x;
    }
}

class StatsPanel {
    #html;
    #list;

    constructor(scale, shopItems) {
        this.#html = document.createElement("aside");
        this.#html.className = "stats-panel";
        this.#html.style.width = `${scale * 150}px`;
        this.#list = new Array();

        const scoreItem = new StatsItem(scale, "Number of Clicks", 0);

        this.#list.push(scoreItem);
        this.#html.appendChild(scoreItem.HTMLObj);

        shopItems.forEach((item) => {
            const shopItem = new StatsItem(scale, item.name, 0);

            this.#list.push(shopItem);
            this.#html.appendChild(shopItem.HTMLObj);
        });
    }

    get HTMLObj() {
        return this.#html;
    }

    getItem(name) {
        return this.#list.find((i) => i.name === name);
    }

    getItemValue(name) {
        return this.getItem(name).value;
    }

    incrementItemValue(name, value) {
        this.getItem(name).incrementValue(value);
    }
}

class GameArea {
    #html;
    #button;
    #child;
    #hasChild = false;
    #scale;

    constructor(scale, buttonCallback, childCallback) {
        this.#html = document.createElement("section");
        this.#html.className = "game-area";
        this.#html.style.width = `${scale * 500}px`;

        this.#child = document.createElement("button");
        this.#child.className = "child-spawner";
        this.#child.innerText = `Click a clicker! (${100 * 1/scale} clicks)`;
        this.#child.onclick = () => childCallback();

        this.#button = document.createElement("button");
        this.#button.className = "clicker-button";
        this.#button.innerHTML = `<img src="https://cdn.creazilla.com/cliparts/3224900/mouse-clipart-md.png" style="width: ${scale * 200}px;" />`;
        this.#button.onclick = () => buttonCallback(1);

        this.#html.appendChild(this.#child);
        this.#html.appendChild(this.#button);

        this.#scale = scale;
    }

    createChild() {
        const childFrame = new Frame(this.#scale / 2);
        this.#hasChild = true;

        this.#child.remove();
        this.#child = childFrame;

        frames.push(childFrame);
        this.#html.insertBefore(childFrame.HTMLObj, this.#button);
    }

    get hasChild() {
        return this.#hasChild;
    }

    get child() {
        return this.#child;
    }

    get HTMLObj() {
        return this.#html;
    }
}

class ShopItem {
    #html;
    #cost;
    #costDisplay;
    #buyButton;
    #name;

    constructor(scale, name, description, cost, purchaseCallback) {
        this.#html = document.createElement("div");
        this.#html.className = "shop-item"
        this.#html.innerHTML = `<h3>${name}</h3><p>${description}</p>`;
        this.#html.style.width = `${scale * 125}px`;

        this.#name = name;

        this.#cost = cost;
        this.#costDisplay = document.createElement("p");
        this.#costDisplay.innerText = this.cost;
        this.#html.append(this.#costDisplay);

        this.#buyButton = document.createElement("button");
        this.#buyButton.innerHTML = `Buy: ${cost} clicks`;
        this.#buyButton.className = "buy-button";
        this.#buyButton.onclick = () => purchaseCallback(name);
        this.#html.appendChild(this.#buyButton);
    }

    get HTMLObj() {
        return this.#html;
    }

    get name() {
        return this.#name;
    }

    get cost() {
        return this.#cost;
    }

    set cost(x) {
        this.#cost = x;
        this.#costDisplay.innerText = x;
    }
}

class ShopPanel {
    #html;
    #list;

    constructor(scale, shopItems, purchaseCallback) {
        this.#html = document.createElement("aside");
        this.#html.className = "shop-panel"
        this.#html.style.width = `${scale * 150}px`;

        this.#list = new Array();

        shopItems.forEach((item) => {
            const shopItem = new ShopItem(scale, item.name, item.description, item.cost, purchaseCallback);
            this.#list.push(shopItem);
            this.#html.appendChild(shopItem.HTMLObj);
        });
    }

    get HTMLObj() {
        return this.#html;
    }

    getItem(x) {
        return this.#list.find((i) => i.name === x);
    }

    getItemCost(name) {
        return this.getItem(name).cost;
    }

    incrementItemCost(name, value) {
        let item = this.getItem(name);

        item.cost = item.cost + value;
    }
}

class Frame {
    #html;
    #child;
    #statsPanel;
    #gameArea;
    #shopPanel;
    #scale;

    constructor(scale) {
        this.#html = document.createElement("section");
        this.#html.className = "frame";
        this.#html.style.width = `${scale * 800}px`;
        this.#html.style["font-size"] = `${scale * 12}px`;

        const items = [
            {
                name: "Alibaba Autoclicker",
                description: "Clicks for you, but not very well...",
                cost: 10,
            },
            {
                name: "Strong Finger",
                description: "Click so hard, you get more clicks per click!",
                cost: 10,
            },
        ];

        this.#statsPanel = new StatsPanel(scale, items);
        this.#gameArea = new GameArea(scale, (x) => this.processClicks(x), () => this.getChild());
        this.#shopPanel = new ShopPanel(scale, items, (x) => this.buyItem(x));

        this.#html.appendChild(this.#statsPanel.HTMLObj);
        this.#html.appendChild(this.#gameArea.HTMLObj);
        this.#html.appendChild(this.#shopPanel.HTMLObj);

        this.#scale = scale;
    }

    get HTMLObj() {
        return this.#html;
    }

    getChild() {
        const clicks = this.#statsPanel.getItemValue("Number of Clicks");
        const cost = 100 * 1/this.#scale; // TODO: Ugly scale hack to determine number of children

        if (clicks >= cost) {
            this.#gameArea.createChild();
            this.#statsPanel.incrementItemValue("Number of Clicks", -cost);
            this.#shopPanel.incrementItemCost(itemName, cost);
        }
    }

    buyItem(itemName) {
        const clicks = this.#statsPanel.getItemValue("Number of Clicks");
        const cost = this.#shopPanel.getItemCost(itemName);

        if (clicks >= cost) {
            this.#statsPanel.incrementItemValue(itemName, 1);
            this.#statsPanel.incrementItemValue("Number of Clicks", -cost);
            this.#shopPanel.incrementItemCost(itemName, cost);
        }
    }

    get clickFactor() {
        return 2 ** this.#statsPanel.getItemValue("Strong Finger");
    }

    get autoClicks() {
        return this.#statsPanel.getItemValue("Alibaba Autoclicker");
    }

    processClicks(count) {
        const newClicks = count * this.clickFactor;
        this.#statsPanel.incrementItemValue("Number of Clicks", newClicks);

        if (this.#gameArea.hasChild) {
            this.#gameArea.child.processClicks(newClicks);
        }
    }
}


frames.push(new Frame(1));
document.getElementById("game-toplevel").appendChild(frames[0].HTMLObj);

setInterval(() => {
    for (let i = 0; i < frames.length; i++) {
        frames[i].processClicks(frames[i].autoClicks);
    }
}, 1000);
