var trees = [];
var count = 0;

function WCloud(dom) {
    this.dom = dom;
    this.init();
};

function Tree(x, y, r, b) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.b = b;
    this.children = null;
};

function makeTree(shape, x, y, r, b) {
    if (intersects(shape, x, y, r, b)) {
        var cx = (x + r) >> 1,
            cy = (y + b) >> 1,
            tree = new Tree(x, y, r, b);
        if (r - x > 2 || b - y > 2) {
            var children = [],
				c0 = makeTree(shape, x, y, cx, cy),
				c1 = makeTree(shape, cx, y, r, cy),
				c2 = makeTree(shape, x, cy, cx, b),
				c3 = makeTree(shape, cx, cy, r, b);
            if (c0) children.push(c0);
            if (c1) children.push(c1);
            if (c2) children.push(c2);
            if (c3) children.push(c3);
            if (children.length) tree.children = children;
        }
        return tree;
    }
    return null;
};

function intersects(shape, x, y, r, b) {
    var w = shape.w,
        sprite = shape.sprite;
    for (var j = 0; j < b - y; j++) {
        for (var i = 0; i < r - x; i++) {
            if (sprite[j * w + i] > 0)
                return true;
        }
    }
    return false;
}

function collision(X, Y, width, height) {
    var box = { x: X, y: Y, r: X + width, b: Y + height };
    if (trees.length > 0) {
        for (var i = 0; i < trees.length; i++) {
            if (overlaps(trees[i], box)) { return true; }
        }
    }
    return false;
};

function overlaps(tree, box) {
    if (rectCollide(tree, box)) {
        if (tree.children == null) {
            return true;
        } else for (var i = 0, n = tree.children.length; i < n; i++) {
            if (overlaps(tree.children[i], box)) return true;
        }
    }
    return false;
};

function rectCollide(tree, box) {
    return tree.b > box.y
        && tree.y < box.b
        && tree.r > box.x
        && tree.x < box.r;
};


WCloud.prototype = {
    init: function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.dom.scrollWidth;
        canvas.height = this.dom.scrollHeight;
        this.dom.appendChild(canvas);
        this.canvas = canvas;
        if (canvas.getContext) {
            var ctx = this.ctx = canvas.getContext('2d');
        };
    },

    draw: function (Data) {
        color = ["#00ced1", "#1e90ff", "#3cb371", "#6a5acd", "#a0522d", "#afeeee", "#bc8f8f", "#cd5c5c", "#dc143c", "#ffb6c1", "#DEB887"];
        var data = Data;
        var ctx = this.ctx;
        count = 0;
        for (var i = 0; i < data.length; i++) {
            ctx.save();
            var ra = Math.round(Math.random() * 10)
            ctx.fillStyle = color[ra]; //color
            var fontsize = "Bold " + data[i].size + "px 微软雅黑";
            ctx.font = fontsize; //size
            var text = data[i].text;
            var tWidth = Math.ceil(ctx.measureText(text).width);
            var tHeight = Math.ceil(data[i].size);
            var angl = 0;
            var ra = 0;
            var x, y;
            while (true) {
                x = Math.round(ra * Math.cos(angl) - tWidth / 2 + this.canvas.width / 2);
                if (x < 5)
                    x = 5;
                if (x > this.canvas.width - tWidth - 5)
                    x = this.canvas.width - tWidth - 5;
                y = Math.round(ra * Math.sin(angl) - tHeight / 2 + this.canvas.height / 2);
                if (y < 5)
                    y = 5;
                if (y > this.canvas.height - tHeight - 5)
                    y = this.canvas.height - tHeight - 5;
                var isCollision = collision(x, y, tWidth + 2, tHeight + 2);
                if (!isCollision) {
                    break;
                }
                ra += tWidth / 180;
                angl += Math.PI / 180;
            };
            ctx.fillText(text, x, y + tHeight);
            var pixels = ctx.getImageData(x, y, tWidth, tHeight).data;
            var s = [];
            for (var k = 0; k < tWidth * tHeight; k++) {
                s[k] = pixels[k * 4 + 1] + pixels[k * 4 + 2] + pixels[k * 4 + 3];
            }
            var shape = { sprite: s, w: tWidth, h: tHeight };
            trees[count] = makeTree(shape, x, y, x + tWidth, y + tHeight);
            count = count + 1;
            ctx.restore();
        };

    }
}
