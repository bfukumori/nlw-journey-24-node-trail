import nodemailer from 'nodemailer';
import { dayjs } from './dayjs.js';

type SendTripCreateEmailParams = {
  destination: string;
  startsAt: Date;
  ownerName: string;
  ownerEmail: string;
  endsAt: Date;
  confirmationLink: string;
};

type SendTripConfirmationEmailParams = {
  destination: string;
  startsAt: Date;
  participantEmail: string;
  endsAt: Date;
  confirmationLink: string;
};

export async function sendTripCreateEmail({
  destination,
  startsAt,
  endsAt,
  ownerName,
  ownerEmail,
  confirmationLink,
}: SendTripCreateEmailParams) {
  try {
    const formattedStartsAt = dayjs(startsAt).format('LL');
    const formattedEndsAt = dayjs(endsAt).format('LL');

    const mail = await getMailClient();

    const message = await mail.sendMail({
      from: {
        name: 'Equipe planner',
        address: 'planner@test.com',
      },
      to: {
        name: ownerName,
        address: ownerEmail,
      },
      subject: `Confirme sua viagem para ${destination} em ${formattedStartsAt}`,
      html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6">
              <p>
                Você solicitou a criação de uma viagem para
                <strong>${destination}</strong> nas datas de
                <strong>${formattedStartsAt}</strong> até <strong>${formattedEndsAt}</strong>.
              </p>
              <br />
              <p>Para confirmar sua viagem, clique no link abaixo:</p>
              <br />
              <p>
                <a href=${confirmationLink}>Confirmar viagem</a>
              </p>
              <br />
              <p>
                Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.
              </p>
            </div>
      `,
    });

    const mockMailLink = nodemailer.getTestMessageUrl(message);
    console.log('Mock mail link:', mockMailLink);

    return { success: true, mockMailLink };
  } catch (error) {
    return { success: false, error: 'Failed to send trip confirmation email' };
  }
}

export async function sendTripConfirmationEmail({
  destination,
  startsAt,
  endsAt,
  participantEmail,
  confirmationLink,
}: SendTripConfirmationEmailParams) {
  try {
    const formattedStartsAt = dayjs(startsAt).format('LL');
    const formattedEndsAt = dayjs(endsAt).format('LL');

    const mail = await getMailClient();

    const message = await mail.sendMail({
      from: {
        name: 'Equipe planner',
        address: 'planner@test.com',
      },
      to: participantEmail,
      subject: `Confirme sua presença na viagem para ${destination} em ${formattedStartsAt}`,
      html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6">
              <p>
                Você foi convidado(a) para participar de uma viagem para
                <strong>${destination}</strong> nas datas de
                <strong>${formattedStartsAt}</strong> até <strong>${formattedEndsAt}</strong>.
              </p>
              <br />
              <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
              <br />
              <p>
                <a href=${confirmationLink}>Confirmar presença</a>
              </p>
              <br />
              <p>
                Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.
              </p>
            </div>
      `,
    });

    const mockMailLink = nodemailer.getTestMessageUrl(message);
    console.log('Mock mail link:', mockMailLink);

    return { success: true, mockMailLink };
  } catch (error) {
    return { success: false, error: 'Failed to send trip confirmation email' };
  }
}

async function getMailClient() {
  const account = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  return transporter;
}
