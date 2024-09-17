import { Component, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import Konva from 'konva';
import jsPDF from 'jspdf';

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
      "id": "2inliekvwors",
      "Retângulo": "x:(26, y:399)",
      "Círculo": "x:(165, y:335)",
      "Mensagem": "Retangulo Roxo"
    },
    "2": {
      "id": "wkwjnpmb24s4",
      "Retângulo": "x:(10, y:13)",
      "Círculo": "x:(379, y:338)",
      "Mensagem": "Circulo Verde"
    },
    "3": {
      "id": "17zeqfba4k74",
      "Retângulo": "x:(28, y:12)",
      "Círculo": "x:(381, y:179)",
      "Mensagem": "retângulo com uma extremidade arredondada Azul"
    },
    "4": {
      "id": "imxp88rn9pkk",
      "Retângulo": "x:(651, y:405)",
      "Círculo": "x:(172, y:178)",
      "Mensagem": "Pentágono Vermelho"
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

    Object.keys(this.pontos).forEach((key) => {
      const button = document.createElement('ion-button');
      button.textContent = `Ponto ${key}`;
      button.color = this.getButtonColor(key);
      button.addEventListener('click', () => this.displayPoint(key));
      buttonContainer.appendChild(button);
    });

    const printButton = document.createElement('ion-button');
    printButton.textContent = 'Capturar Imagem';
    printButton.color = 'secondary';
    printButton.addEventListener('click', () => this.captureImage());
    buttonContainer.appendChild(printButton);

    const pdfButton = document.createElement('ion-button');
    pdfButton.textContent = 'Salvar como PDF';
    pdfButton.color = 'primary';
    pdfButton.addEventListener('click', () => this.saveAsPDF());
    buttonContainer.appendChild(pdfButton);
  }

  private getButtonColor(key: string): string {
    const colors = ['primary'];
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
      strokeWidth: 4,
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

  private captureImage() {
    if (this.stage) {
      const dataURL = this.stage.toDataURL();
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'Imagem.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private saveAsPDF() {
    if (!this.stage) return;
    const pdf = new jsPDF('landscape', 'px', [this.stage.width(), this.stage.height() + 100]);
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const title = `Relatório - ${dateStr} ${timeStr}`;
    const barYPosition = 20; 
    const titleWidth = pdf.getTextWidth(title);
    const titleXPosition = (pdf.internal.pageSize.getWidth() - titleWidth) / 2;
    const imageYPosition = 250; 
    const imageXPosition = 20; 
    const originalWidth = this.stage.width();
    const originalHeight = this.stage.height();
    const scaleFactor = 0.5;
    const imageWidth = originalWidth * scaleFactor;
    const imageHeight = originalHeight * scaleFactor;
    const imageData = this.stage.toDataURL({ pixelRatio: 2 });
    const footerYPosition = pdf.internal.pageSize.getHeight() - 40;
    pdf.setFontSize(20);
    pdf.text(title, titleXPosition, barYPosition + 15); 
    pdf.addImage(imageData, 'PNG', imageXPosition, imageYPosition, imageWidth, imageHeight);
    pdf.setFontSize(16);
    pdf.text(`Nome: retângulo com uma extremidade arredondada Azul`, 20, 60);
    pdf.text(`Grupo: grupo 2`, 20, 80);
    pdf.text(`Operação: Especificação de Objeto`, 20, 100);
    pdf.text(`Descrição: retângulo com uma extremidade arredondada`, 20, 120);
    pdf.text(`Tabela: tabela A`, 20, 140);
    pdf.setFontSize(12);
    pdf.setTextColor(150);
    pdf.text("Este documento é confidencial e para uso interno somente.", 20, footerYPosition);
    pdf.setDrawColor(150);
    pdf.setLineWidth(0.5);
    pdf.line(20, footerYPosition - 10, pdf.internal.pageSize.getWidth() - 20, footerYPosition - 10);
    pdf.setFontSize(10);
    pdf.text("Gerado por Sistema", 20, footerYPosition + 15);
    pdf.text(`Página 1 de 1`, pdf.internal.pageSize.getWidth() - 60, footerYPosition + 15);
    pdf.save('Relatório.pdf');
  }
}
