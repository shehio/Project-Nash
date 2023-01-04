"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.TreeNode = exports.Payoff = exports.Pair = void 0;
// @todo: Add support for n number of points.
exports.Pair = /** @class */ (function () {
    function class_1(x, y) {
        if (arguments.length == 1) {
            if (Array.isArray(x)) {
                this.x = x[0];
                this.y = x[1];
            }
            else {
                this.x = x;
            }
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
    class_1.prototype.toString = function () {
        return "(".concat(this.x, ", ").concat(this.y, ")");
    };
    return class_1;
}());
/**
 *  You can implicitly substitute x for player_one's payoff,
 *  and y for player_two's payoff.
 */
exports.Payoff = /** @class */ (function (_super) {
    __extends(Payoff, _super);
    function Payoff() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // lth: larger_than_horizontal
    Payoff.prototype.lth = function (other) {
        return (this.y > other.y);
    };
    // ltv: larger than vertical
    Payoff.prototype.ltv = function (other) {
        return (this.x > other.x);
    };
    return Payoff;
}(exports.Pair));
/**
 *  Assume that only a leaf node can have a value.
 *  An intermediate decision node doesn't cary a value.
 */
exports.TreeNode = /** @class */ (function () {
    function class_2(value) {
        this.value = value;
        this.children = [];
    }
    class_2.prototype.add_child = function (child) {
        this.children.push(child);
    };
    class_2.prototype.is_leaf = function () {
        return (this.children.length === 0);
    };
    class_2.prototype.get_value = function (player) {
        if (player == 1) {
            return this.value.x;
        }
        return this.value.y;
    };
    return class_2;
}());
