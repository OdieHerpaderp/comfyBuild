var jsFrame = new JSFrame();

var jsFrameDefaults = {
    name: `frameUndefined`,
    title: `FIX ME!`,
    left: 0, top: 0, width: 100, height: 100, minWidth: 100, minHeight: 100,
    appearanceName: 'material',
    appearanceParam: {
        border: {
            width: 0,
            radius: 2,
        },
        titleBar: {
            color: 'white',
            background: '#33333399',
            leftMargin: 8,
            height: 16,
            fontSize: 14,
            buttonWidth: 36,
            buttonHeight: 16,
            buttonColor: 'white',
            buttons: [ // buttons on the right
            ],
            buttonsOnLeft: [ //buttons on the left
            ],
        },
    },
    style: {
        backgroundColor: '#22222255',
        overflow: 'auto',
        width: '100%',
        fontSize: 18
    },

    html: `<div id="content"></div>`
};

var jsFrameMixin = {
    showFrame() {
        if (!this.frame) {
            this.createFrame();
        }
        this.frame.show();
    },
    closeFrame() {
        if (!this.frame) {
            return;
        }
        this.frame.closeFrame();
        this.frame = undefined;
    },
    hideFrame() {
        if (!this.frame) {
            return;
        }
        this.frame.hide();
    },
    createFrame() {
        var settings = structuredClone(jsFrameDefaults);
        if (this.jsFrameSettings) {
            Object.assign(settings, this.jsFrameSettings);
        }

        this.frame = jsFrame.create(settings);

        if (this.HTML) {
            this.frame.$("#content").replaceWith(this.HTML);
        }
        else if (this.domElement) {
            this.frame.$("#content").replaceWith(this.domElement);
        }
    },
    setFramePosition(x, y, anchor) {
        if (!this.frame) {
            this.createFrame();
        }
        this.frame.setPosition(x, y, anchor);
    }
}

export { jsFrame, jsFrameDefaults, jsFrameMixin };