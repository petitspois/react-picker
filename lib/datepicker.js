'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./js/mui');

require('./js/picker');

var _dtpicker = require('./js/dtpicker');

var _dtpicker2 = _interopRequireDefault(_dtpicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DatePicker = function (_Component) {
    _inherits(DatePicker, _Component);

    function DatePicker(props) {
        _classCallCheck(this, DatePicker);

        var _this = _possibleConstructorReturn(this, (DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).call(this, props));

        _this.userPicker = {};
        return _this;
    }

    _createClass(DatePicker, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.userPicker = new _dtpicker2.default(this.props.options);
            this.userPicker.ui.cancel.addEventListener('tap', function (event) {
                _this2.props.cancel();
            }, false);
            this.userPicker.ui.mask[0].addEventListener('tap', function () {
                _this2.props.cancel();
            }, false);
        }
    }, {
        key: 'show',
        value: function show() {
            var _this3 = this;

            this.userPicker.show(function (items) {
                _this3.props.getData(items.text);
                _this3.props.cancel && _this3.props.cancel();
            });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.props.visible) {
                this.show();
            } else {
                this.userPicker.hide();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement('div', { style: { display: 'none' } });
        }
    }]);

    return DatePicker;
}(_react.Component);

DatePicker.defalutProps = {
    visible: false,
    options: {}
};
DatePicker.propTypes = {
    visible: _react.PropTypes.bool,
    getData: _react.PropTypes.func,
    confirm: _react.PropTypes.func,
    cancel: _react.PropTypes.func,
    options: _react.PropTypes.object
};
exports.default = DatePicker;