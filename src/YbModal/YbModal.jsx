import React, { Component } from 'react';
import "./YbModal.scss";

class YbModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null,
            rootSty: Object.assign({}, styles.root, styles.hide, {}),
            dialogWidth: 400,
            dialogHeight: 300,
            xPosition: 0.5,
            yPosition: 0.5,
            headHeight: 48,
            contentSty: {}
        }
    }

    showModal = () => {
        let { rootSty } = this.state;
        this.setState({
            rootSty: Object.assign({}, rootSty, styles.show, {})
        }, () => {
            this.__updateDialogSize();
        });
    }

    __updateDialogSize = () => {
        let { dialogWidth, dialogHeight, headHeight, contentSty } = this.state;
        let { clientWidth, clientHeight } = this.dialogContent.children[0];
        let bodyWidth = document.body.clientWidth, bodyHeight = document.body.clientHeight;
        // dialog的最大高度和最大宽度分别为浏览器可见窗口尺寸的0.9倍
        bodyWidth *= 0.9;
        bodyHeight *= 0.9;
        let finalWidth;
        if(clientWidth <= dialogWidth){
            finalWidth = dialogWidth;
        }else if(clientWidth > bodyWidth){
            finalWidth = bodyWidth;
        }else{
            // fix scrollbar在第一次打开时对宽度的影响
            finalWidth = clientWidth + 8;
        }
        let finalHeight;
        if (clientHeight <= dialogWidth - headHeight) {
            finalHeight = dialogHeight;
        } else if (clientHeight > bodyHeight - headHeight) {
            finalHeight = bodyHeight;
        } else {
            // fix scrollbar在第一次打开时对高度的影响，但是如果内容的高度正好等于最大值，则右边和下边会有个白条
            finalHeight = clientHeight + headHeight + 8;
        }
        // console.log(dialogWidth, dialogHeight);
        // console.log(clientWidth, clientHeight);
        // console.log(bodyWidth, bodyHeight);
        // console.log(finalWidth, finalHeight);
        this.setState({
            dialogWidth: finalWidth,
            dialogHeight: finalHeight,
        });
    }

    closeModal = () => {
        this.setState(prev => {
            this.setState({
                rootSty: Object.assign({}, prev.rootSty, styles.hide, {})
            });
        });
    }

    init = (contentDomNode) => {
        this.setState({
            content: contentDomNode
        });
    }

    __createDom = (content) => {
        return React.createElement(content.type, { ...content.props });
    }

    render() {
        const { content } = this.state;
        let contentEle = null;
        if (content) {
            contentEle = this.__createDom(content);
        }
        return (
            <div id="ybmodal-root" style={this.state.rootSty}>
                <div id="mask" style={styles.mask} onClick={() => {
                    this.closeModal();
                }} />
                <div id="dialog" ref={c => this.dialog = c} style={Object.assign({}, styles.dialog, {
                    left: `${this.state.xPosition * 100}%`,
                    top: `${this.state.yPosition * 100}%`,
                    width: `${this.state.dialogWidth}px`,
                    height: `${this.state.dialogHeight}px`,
                    marginLeft: `-${this.state.dialogWidth * this.state.xPosition}px`,
                    marginTop: `-${this.state.dialogHeight * this.state.yPosition}px`
                })}>
                    <div id="header" style={Object.assign({}, styles.header, {
                        height: `${this.state.headHeight}px`
                    })}>
                        <span>Modal标题</span>
                        <i style={styles.closeBtn} onClick={() => {
                            this.closeModal();
                        }}>×</i>
                    </div>
                    <div id="content" ref={c => this.dialogContent = c} style={Object.assign({}, styles.content, {
                        height: `${this.state.dialogHeight - this.state.headHeight}px`
                    })}>
                        {contentEle}
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    root: {
        width: `${document.body.width}px`,
        height: `${document.body.height}px`,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    mask: {
        backgroundColor: 'black',
        opacity: 0.5,
        width: `${document.body.width}px`,
        height: `${document.body.height}px`,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    dialog: {
        width: 'auto',
        height: 'auto',
        position: 'absolute',
        backgroundColor: 'white'
    },
    show: {
        display: 'block'
    },
    hide: {
        display: 'none'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        backgroundColor: '#eee',
    },
    content: {
        overflow: 'auto',
    },
    closeBtn: {
        fontSize: '2rem',
        cursor: 'pointer'
    }
}

let divDom = document.createElement("div");
document.body.appendChild(divDom);
let WrapperYbModal = ReactDOM.render(React.createElement(YbModal), divDom);
export default WrapperYbModal;
