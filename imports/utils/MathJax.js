function initMathJax() {
    if(typeof MathJax !== "undefined") {
        MathJax.Hub.Config({
            showProcessingMessages: false,
            tex2jax: {inlineMath: [['$', '$'], ['\\(', '\\)']]}
        });
    }
}

function renderMatJax() {
    if(typeof MathJax !== "undefined") {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
}


export const MathJaxHelper = {
    init: function () {
        if(typeof MathJax !== "undefined") {
            initMathJax();
        } else {
            setTimeout(initMathJax, 500);
        }
    },
    render: function () {
        if(typeof MathJax !== "undefined") {
            renderMatJax();
        } else {
            setTimeout(renderMatJax, 500);
        }
    },
    rerender: function () {
        this.init();
        this.render();
    }
};