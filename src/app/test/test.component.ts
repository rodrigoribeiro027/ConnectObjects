import { Component, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import Konva from 'konva';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TestComponent implements AfterViewInit {

  private pontos = {
    "1": {
      "id": "uzb6g5ejmd4t",
      "Retângulo": "x:(270, y:375)",
      "Círculo": "x:(51, y:324)",
      "Mensagem": "Quadrado Roxo"
    },
    "2": {
      "id": "1ez4l2gnz4ja",
      "Retângulo": "x:(670, y:0)",
      "Círculo": "x:(740, y:301)",
      "Mensagem": "O melhor"
    },
    "3": {
      "id": "1aab79c0ge65",
      "Retângulo": "x:(225, y:298)",
      "Círculo": "x:(737, y:303)",
      "Mensagem": "Parede Amarela"
    }
  };

  private stage: Konva.Stage | null = null;
  private layer: Konva.Layer | null = null;

  ngAfterViewInit() {
    const width = 820;
    const height = 520;

    this.stage = new Konva.Stage({
      container: 'test-container',
      width: width,
      height: height,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

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
      this.layer?.add(konvaImage);

      this.createButtons();
    };
  }

  private createButtons() {
    const buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) return;

    buttonContainer.innerHTML = '';

    Object.keys(this.pontos).forEach(key => {
      const button = document.createElement('ion-button');
      button.textContent = `Ponto ${key}`;
      button.color = this.getButtonColor(key);
      button.addEventListener('click', () => this.displayPoint(key));
      buttonContainer.appendChild(button);
    });
  }

  private getButtonColor(key: string): string {
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];
    const index = parseInt(key) % colors.length;
    return colors[index];
  }

  private displayPoint(key: string) {
    this.layer?.destroyChildren();

    const imageObj = new Image();
    imageObj.src = '../../assets/shapes.svg'; 
    imageObj.onload = () => {
      const konvaImage = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: this.stage?.width() || 820,
        height: this.stage?.height() || 520,
        id: 'background-image',
      });
      this.layer?.add(konvaImage);

      this.drawPoint(key);
    };
  }

  private drawPoint(key: string) {
    const ponto = this.pontos[key as keyof typeof this.pontos];

    const retanguloCoords = this.extractCoordinates(ponto['Retângulo']);
    const circuloCoords = this.extractCoordinates(ponto['Círculo']);
    const mensagem = ponto['Mensagem'];

    const rect = new Konva.Rect({
      x: retanguloCoords.x,
      y: retanguloCoords.y,
      width: 150,
      height: 100,
      fill: 'white',
      shadowBlur: 10,
      draggable: false, 
      id: ponto.id,
    });
    this.layer?.add(rect);

    const circle = new Konva.Circle({
      x: circuloCoords.x,
      y: circuloCoords.y,
      radius: 7,
      fill: 'white',
      shadowBlur: 10,
      draggable: false,  
      id: ponto.id,
    });
    this.layer?.add(circle);

    const rectEdge = this.getRectEdgePoint(rect, circle.position());
    const circleEdge = this.getCircleEdgePoint(circle, rect.position());

    const line = new Konva.Line({
      points: [circleEdge.x, circleEdge.y, rectEdge.x, rectEdge.y],
      stroke: 'black',
      strokeWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
    });
    this.layer?.add(line);

    const text = new Konva.Text({
      text: mensagem,
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

    this.layer?.add(text);

    this.layer?.draw();
  }

  private getRectEdgePoint(rect: Konva.Rect, point: Konva.Vector2d): Konva.Vector2d {
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

  private getCircleEdgePoint(circle: Konva.Circle, point: Konva.Vector2d): Konva.Vector2d {
    const circleX = circle.x();
    const circleY = circle.y();
    const radius = circle.radius();

    const angle = Math.atan2(point.y - circleY, point.x - circleX);

    return {
      x: circleX + radius * Math.cos(angle),
      y: circleY + radius * Math.sin(angle),
    };
  }

  private extractCoordinates(coordString: string): { x: number; y: number } {
    const regex = /x:\((\d+), y:(\d+)\)/;
    const matches = coordString.match(regex);

    if (matches && matches.length === 3) {
      return {
        x: parseInt(matches[1], 10),
        y: parseInt(matches[2], 10),
      };
    } else {
      return { x: 0, y: 0 };
    }
  }
}
