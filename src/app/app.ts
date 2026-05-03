import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = signal('links-covii');
  activePreview = signal<string>('all'); // 'all', 'instagram', 'facebook', 'whatsapp', 'email', 'website'
  isLogoModalOpen = signal<boolean>(false);
  isIntroDone = signal<boolean>(false);
  showBubble = signal<boolean>(true);

  ngOnInit() {
    setTimeout(() => {
      this.isIntroDone.set(true);
      setInterval(() => {
        this.showBubble.update(v => !v);
      }, 10000);
    }, 5500);
  }

  openLogoModal() {
    this.isLogoModalOpen.set(true);
  }

  closeLogoModal() {
    this.isLogoModalOpen.set(false);
  }

  isChatOpen = signal<boolean>(false);
  chatMessage: string = '';
  chatStep = signal<number>(0);
  userName: string = '';
  userCompany: string = '';
  userInterest: string = '';

  chatMessages = signal<{ sender: string, text: string, time: string }[]>([
    { sender: 'bot', text: 'Olá! Sou a Nexus AI, assistente inteligente da Covii.soft. Como posso ajudar a sua empresa hoje?', time: '21:53' }
  ]);

  toggleChat() {
    this.isChatOpen.update(v => !v);
  }

  selectChatOption(option: string) {
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    this.userInterest = option;

    this.chatMessages.update(msgs => [
      ...msgs,
      { sender: 'user', text: option, time },
      { sender: 'bot', text: 'Excelente escolha! Automação e IA trazem retornos incríveis. Para agendarmos uma demonstração, qual o seu nome completo e o nome da sua empresa?', time }
    ]);
    this.chatStep.set(1);
  }

  sendChatForm() {
    if (this.userName.trim() && this.userCompany.trim()) {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

      this.chatMessages.update(msgs => [
        ...msgs,
        { sender: 'user', text: `Sou o ${this.userName} da empresa ${this.userCompany}.`, time },
        { sender: 'bot', text: `Muito prazer, ${this.userName}! Nossas automações são feitas sob medida para acelerar a ${this.userCompany}. Clique no botão abaixo para falar diretamente com nosso especialista no WhatsApp e receber sua proposta personalizada!`, time }
      ]);
      this.chatStep.set(2);
    }
  }

  sendChatMessage() {
    if (this.chatMessage.trim()) {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      const userMsg = this.chatMessage;
      
      this.chatMessages.update(msgs => [...msgs, { sender: 'user', text: userMsg, time }]);
      this.chatMessage = '';

      setTimeout(() => {
        this.chatMessages.update(msgs => [...msgs, {
          sender: 'bot',
          text: 'Entendido! Para que eu possa te passar mais informações personalizadas sobre essa solução, qual o seu nome e o nome da sua empresa?',
          time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
        }]);
        this.chatStep.set(1);
      }, 1000);
    }
  }

  getWhatsAppLink(): string {
    const interest = this.userInterest || 'Automação & IA';
    return `https://wa.me/5541984837391?text=Olá! Gostaria de falar sobre o projeto. Nome: ${encodeURIComponent(this.userName)}, Empresa: ${encodeURIComponent(this.userCompany)}, Interesse: ${encodeURIComponent(interest)}`;
  }

  // Instagram simulated states
  followers = signal<number>(1240);
  isFollowing = signal<boolean>(false);
  instaLikes = signal<number[]>([142, 238, 95]);

  // WhatsApp simulated input (plain string for ngModel compatibility)
  waMessage: string = '';

  // Email simulated form (plain strings for ngModel compatibility)
  emailSubject: string = '';
  emailBody: string = '';
  emailSent = signal<boolean>(false);

  setPreview(platform: string) {
    this.activePreview.set(platform);
  }

  toggleFollow() {
    this.isFollowing.update(val => !val);
    this.followers.update(val => this.isFollowing() ? val + 1 : val - 1);
  }

  likePost(index: number) {
    this.instaLikes.update(likes => {
      const copy = [...likes];
      copy[index]++;
      return copy;
    });
  }

  sendEmailForm() {
    if (this.emailSubject && this.emailBody) {
      this.emailSent.set(true);
      const subject = encodeURIComponent(this.emailSubject);
      const body = encodeURIComponent(this.emailBody);
      window.open(`mailto:covii@coviisoft.com?subject=${subject}&body=${body}`, '_blank');
      setTimeout(() => this.emailSent.set(false), 4000);
      this.emailSubject = '';
      this.emailBody = '';
    }
  }

  openWhatsApp() {
    const text = encodeURIComponent(this.waMessage || 'Olá, vim através dos seus links do site.');
    window.open(`https://wa.me/5541984837391?text=${text}`, '_blank');
  }
}
