class ChatMessage {
  idSender: any;
  nameSender: any;
  imgSender: any;
  sendTime: any;
  messageSender: any;
  constructor(idSender, nameSender) {
    this.idSender = idSender;
    this.nameSender = nameSender;
    this.imgSender = this.setImageSender;
    this.messageSender = '';
    this.sendTime = this.setMessageTime();
  }

  setImageSender() {
    if (!this.imgSender) {
      ('assets/img/avatar.png');
    }
  }

  setMessageTime() {
    let currentdate = new Date();
    let datetime =
      currentdate.getDate() +
      '.' +
      (currentdate.getMonth() + 1) +
      '.' +
      currentdate.getFullYear() +
      ', ' +
      currentdate.getHours() +
      ':' +
      currentdate.getMinutes();
    return datetime;
  }
}
