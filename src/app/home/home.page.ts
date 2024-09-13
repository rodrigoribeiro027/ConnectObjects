import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { Component, AfterViewInit } from '@angular/core';
import Konva from 'konva';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton],
})
export class HomePage implements AfterViewInit {

  private rectPosition = { x: 0, y: 0 };
  private circlePosition = { x: 0, y: 0 };
  private rectMessage = '';
  private pontosCounter = 1; 
  private pontos: any = {}; 

  ngAfterViewInit() {
    const width = 820;
    const height = 520;

    const stage = new Konva.Stage({
      container: 'container', 
      width: width,
      height: height,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const imageObj = new Image();
    imageObj.src = '../../assets/shapes.svg'; 

    imageObj.onload = () => {
      const konvaImage = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: width,
        height: height,
        id: 'background-image',
      });
      layer.add(konvaImage);

      const rectId = this.generateUniqueId();
      const circleId = this.generateUniqueId();

      const rect = new Konva.Rect({
        x: width / 4 - 100, 
        y: height / 2 - 50, 
        width: 150,
        height: 100,
        fill: 'white', 
        shadowBlur: 10,
        draggable: true,
        id: rectId,
      });
      layer.add(rect);

      const circle2 = new Konva.Circle({
        x: (3 * width) / 4,
        y: height / 2,
        width: 200,
        height: 100,
        radius: 7,
        fill: 'white', 
        shadowBlur: 10,
        draggable: true,
        id: circleId,
      });
      layer.add(circle2);

      const line = new Konva.Line({
        stroke: 'black',
        strokeWidth: 2,
        id: 'line',
      });
      layer.add(line);

      const getRectEdgePoint = (rect: Konva.Rect, point: Konva.Vector2d): Konva.Vector2d => {
        const rectX = rect.x();
        const rectY = rect.y();
        const rectWidth = rect.width();
        const rectHeight = rect.height();

        const midX = rectX + rectWidth / 2;
        const midY = rectY + rectHeight / 2;

        const slope = (point.y - midY) / (point.x - midX);

        if (point.x < midX) { 
          const y = midY + slope * (-rectWidth / 2);
          if (y >= rectY && y <= rectY + rectHeight) {
            return { x: rectX, y };
          }
        }

        if (point.x > midX) { 
          const y = midY + slope * (rectWidth / 2);
          if (y >= rectY && y <= rectY + rectHeight) {
            return { x: rectX + rectWidth, y };
          }
        }

        if (point.y < midY) { 
          const x = midX + (-rectHeight / 2) / slope;
          if (x >= rectX && x <= rectX + rectWidth) {
            return { x, y: rectY };
          }
        }

        if (point.y > midY) { 
          const x = midX + (rectHeight / 2) / slope;
          if (x >= rectX && x <= rectX + rectWidth) {
            return { x, y: rectY + rectHeight };
          }
        }

        return { x: midX, y: midY };
      }

      const getCircleEdgePoint = (circle: Konva.Circle, point: Konva.Vector2d): Konva.Vector2d => {
        const circleX = circle.x();
        const circleY = circle.y();
        const radius = circle.radius();

        const angle = Math.atan2(point.y - circleY, point.x - circleX);

        return {
          x: circleX + radius * Math.cos(angle),
          y: circleY + radius * Math.sin(angle),
        };
      }

      const updateLine = () => {
        const rectEdge = getRectEdgePoint(rect, circle2.position());
        const circleEdge = getCircleEdgePoint(circle2, rect.position());
        line.points([rectEdge.x, rectEdge.y, circleEdge.x, circleEdge.y]);
        layer.batchDraw();
      }

      rect.on('dragmove', () => {
        const newX = Math.max(0, Math.min(width - rect.width(), rect.x()));
        const newY = Math.max(0, Math.min(height - rect.height(), rect.y()));
        rect.position({ x: newX, y: newY });

        this.rectPosition = { x: newX, y: newY };
        text.position({
          x: newX + (rect.width() - text.width()) / 2,
          y: newY + (rect.height() - text.height()) / 2,
        });
        updateLine();
        this.updateDetails(`ID: ${rect.id()}, X: ${newX}, Y: ${newY}`, 'rect-details');
      });

      circle2.on('dragmove', () => {
        const newX = Math.max(circle2.radius(), Math.min(width - circle2.radius(), circle2.x()));
        const newY = Math.max(circle2.radius(), Math.min(height - circle2.radius(), circle2.y()));
        circle2.position({ x: newX, y: newY });

        this.circlePosition = { x: newX, y: newY };
        updateLine();
        this.updateDetails(`ID: ${circle2.id()}, X: ${newX}, Y: ${newY}`, 'circle-details');
      });

      const text = new Konva.Text({
        text: '',
        fontSize: 16,
        fontFamily: 'Calibri',
        fill: 'black',
        width: rect.width() - 10,
        align: 'center',
      });

      text.position({
        x: rect.x() + (rect.width() - text.width()) / 2,
        y: rect.y() + (rect.height() - text.height()) / 2,
      });

      layer.add(text);

      const updateText = () => {
        const inputText = (document.getElementById('text-input') as HTMLInputElement).value;
        text.text(inputText);
        this.rectMessage = inputText;

        text.position({
          x: rect.x() + (rect.width() - text.width()) / 2,
          y: rect.y() + (rect.height() - text.height()) / 2,
        });

        layer.batchDraw();

        this.updateMessageDetails(`ID: ${rect.id()}, Mensagem: ${inputText}`);
      }

      document.getElementById('update-text')?.addEventListener('click', updateText);

      const saveData = () => {
        this.pontos[this.pontosCounter] = {
          id: this.generateUniqueId(),
          "Retângulo": `x:(${this.rectPosition.x}, y:${this.rectPosition.y})`,
          "Círculo": `x:(${this.circlePosition.x}, y:${this.circlePosition.y})`,
          "Mensagem": this.rectMessage
        };
        this.pontosCounter++;

        console.log(JSON.stringify({ pontos: this.pontos }, null, 2));
      }

      document.getElementById('confirm-button')?.addEventListener('click', saveData);

      layer.draw();
      updateLine();
    };
  }

  private updateDetails(details: string, elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = details;
    }
  }

  private updateMessageDetails(details: string) {
    const element = document.getElementById('message-details');
    if (element) {
      element.textContent = details;
    }
  }
  
  private generateUniqueId(): string {
    const randomPart = Math.random().toString(36).substr(2, 8);
    const timePart = Date.now().toString(36).substr(-4);
    return `${randomPart}${timePart}`;
  }

  private drawPoints(points: { x: number, y: number, color: string }[], layer: Konva.Layer) {
    points.forEach(point => {
      const circle = new Konva.Circle({
        x: point.x,
        y: point.y,
        radius: 7,
        fill: point.color, 
        stroke: 'black',
        strokeWidth: 1,
      });
      layer.add(circle);
    });

    layer.draw(); 
  }
}
