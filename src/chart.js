const Chart = (ctx, { 
    width, 
    height, 
    margin, 
    textMargin, 
    extraMargin,
    arrowSize
}) => {
    const fullWidth =  width+margin*2+extraMargin;
    const fullHeight = height+margin*2+extraMargin;

    const chart = {
        drawBackground: () => {
            ctx.fillStyle = "white";            
            ctx.fillRect(0, 0, fullWidth, fullHeight);

            return chart;
        },
        drawYAxis: label => {
            const axisStartY = fullHeight-textMargin;
            const axisEndY = textMargin;

            const axisX = margin;

            // drawing Y label
            const yLabelBB = ctx.measureText(label);

            ctx.font = "bold 1.25em sans-serif";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";

            ctx.save();
            ctx.translate(axisX - textMargin - yLabelBB.actualBoundingBoxDescent, fullWidth/2);
            ctx.rotate(-Math.PI/2);
            ctx.textAlign = "center";
            ctx.fillText(label, 0, 0);
            ctx.restore();

            // drawing Y axis
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(axisX, axisStartY);
            ctx.lineTo(axisX, axisEndY);

            ctx.moveTo(axisX + arrowSize, axisEndY + arrowSize);
            ctx.lineTo(axisX, axisEndY);
            ctx.lineTo(axisX - arrowSize, axisEndY + arrowSize);

            ctx.stroke();

            return chart;
        },
        drawXAxis: label => {
            const axisStartX = textMargin;
            const axisEndX = fullWidth - textMargin;

            const axisY = fullHeight - margin;

            // drawing X label
            const xLabelBB = ctx.measureText(label);
            ctx.textAlign = "center";
            ctx.fillText(label, fullWidth/2, fullHeight - textMargin - xLabelBB.actualBoundingBoxAscent);

            ctx.font = "bold 1.25em sans-serif";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";

            // drawing X axis
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(axisStartX, axisY);
            ctx.lineTo(axisEndX, axisY);

            ctx.moveTo(axisEndX - arrowSize, axisY - arrowSize);
            ctx.lineTo(axisEndX, fullHeight - margin);
            ctx.lineTo(axisEndX - arrowSize, axisY + arrowSize);

            ctx.stroke();

            return chart;
        },
        clear: () => {
            chart.drawBackground();
            chart.drawYAxis();
            chart.drawXAxis();
            return chart;
        }
    };

    return chart;
};