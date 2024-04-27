const Chart = (ctx, { 
    width, 
    height, 
    margin, 
    textMargin, 
    assumptionRadius, 
    assumptionScale,
    arrowSize,
    maxLabelWidth
}) => {
    const fullWidth =  width+margin*2+assumptionRadius;
    const fullHeight = height+margin*2+assumptionRadius;

    const colorPalette = [
        "#937264", // Notion Brown
        "#FFA344", // Notion Orange
        "#FFDC49", // Notion Yellow
        "#4DAB9A", // Notion Green
        "#529CCA", // Notion Blue
        "#9A6DD7", // Notion Purple
        "#E255A1", // Notion Pink
        "#FF7369", // Notion Red
        "#979A9B" // Notion Grey
    ];

    return {
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
        },
        drawAssumptions: ({ assumptions, opacity}) => {
            const startGridX = margin;
            const startGridY = fullHeight - margin;

            const drawAssumptionDot = ({ assumption, idx }) => {
                //drawing assumption dot
                ctx.beginPath();
                ctx.fillStyle = colorPalette[idx % colorPalette.length];
                ctx.beginPath();
                ctx.arc(
                    assumption.uncertainty * (width/assumptionScale) + startGridX, 
                    startGridY - (assumption.criticality * (height/assumptionScale)), 
                    assumptionRadius, 
                    -assumptionRadius, 
                    2 * Math.PI
                );
                ctx.fill();
            }
            const drawAssumptionIdxLabel = ({ assumption, idx }) => {
                // drawing assumption label
                ctx.fillStyle = colorPalette[idx % colorPalette.length];

                ctx.fillText(
                    `A${idx + 1}`, 
                    startGridX + assumption.uncertainty * (width / assumptionScale) + assumptionRadius, 
                    startGridY - assumption.criticality * (height / assumptionScale) + 5 + assumptionRadius*2
                );
            }
            const drawAssumptionFullLabel = ({assumption, idx}) => {
                const assumptionNameWords = assumption.name.match(/A\d+ - (.*)/)[1].split(" ");
                const assumptionNameLines = [];
                for (let i = 0, labelWidth = 0; i < assumptionNameWords.length; i++) {
                    const wordWidth = ctx.measureText(assumptionNameWords[i]).width;
                    labelWidth += wordWidth;
                    
                    if (i == 0 || labelWidth > maxLabelWidth) {
                        assumptionNameLines.push(assumptionNameWords[i]);
                        labelWidth = wordWidth;
                    } else {
                        assumptionNameLines[assumptionNameLines.length-1] += ` ${assumptionNameWords[i]}`;
                    }
                }   

                const lineBB = ctx.measureText("line");
                const lineHeight = lineBB.fontBoundingBoxAscent + lineBB.fontBoundingBoxDescent;

                ctx.fillStyle = colorPalette[idx % colorPalette.length];
                
                assumptionNameLines.map((line, lineIdx) => {                
                    ctx.fillText(
                        line,
                        startGridX + assumption.uncertainty * (width/assumptionScale) + assumptionRadius,
                        startGridY - assumption.criticality * (height/assumptionScale) + 5 + assumptionRadius*2 + lineHeight * (lineIdx + 1)
                    );
                })
            }

            assumptions.map((assumption, idx) => {
                ctx.textAlign = "right";
                ctx.globalAlpha = opacity;
                drawAssumptionDot({ assumption, idx });

                ctx.font = "0.8em sans-serif";
                drawAssumptionIdxLabel({ assumption, idx });

                ctx.font = "0.6em sans-serif";
                ctx.font = "0.8em sans-serif";
                drawAssumptionFullLabel({ assumption, idx });
            })
        }
    };
};