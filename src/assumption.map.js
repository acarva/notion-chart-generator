const AssumptionMap = (ctx, { 
    width, 
    height, 
    margin, 
    textMargin, 
    assumptionRadius, 
    assumptionScale,
    arrowSize,
    maxLabelWidth
}) => {
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

    const chart = Chart(ctx, { 
        width, 
        height, 
        margin, 
        textMargin, 
        extraMargin: assumptionRadius, 
        arrowSize
    });
    const assumptionMap = {
        drawBackground: () => { 
            chart.drawBackground(); 
            return assumptionMap;
        },
        drawYAxis: () => {
            chart.drawYAxis("Criticality");
            return assumptionMap;
        },
        drawXAxis: () => {
            chart.drawXAxis("Uncertainty");
            return assumptionMap;
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

            return assumptionMap;
        },
        clear: () => {
            chart.drawBackground();
            assumptionMap.drawYAxis();
            assumptionMap.drawXAxis();
            return assumptionMap;
        }
    };

    return assumptionMap;
}