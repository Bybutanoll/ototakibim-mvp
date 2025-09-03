import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export interface EmailData {
  to: string;
  subject: string;
  template: string;
  variables: Record<string, any>;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Demo mode için mock transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'demo@ototakibim.com',
        pass: process.env.SMTP_PASS || 'demo-password'
      }
    });
  }

  /**
   * Email template'ini yükler ve değişkenleri yerleştirir
   */
  private async loadTemplate(templateName: string, variables: Record<string, any>): Promise<string> {
    try {
      const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
      let template = fs.readFileSync(templatePath, 'utf-8');
      
      // Değişkenleri yerleştir
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, variables[key]);
      });
      
      return template;
    } catch (error) {
      console.error('Template yüklenirken hata:', error);
      return this.getFallbackTemplate(variables);
    }
  }

  /**
   * Fallback template (template dosyası bulunamazsa)
   */
  private getFallbackTemplate(variables: Record<string, any>): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e293b;">Hoş Geldiniz, ${variables.firstName || 'Kullanıcı'}! 🎉</h1>
        <p style="color: #64748b; line-height: 1.6;">
          OtoTakibim ailesine katıldığınız için teşekkür ederiz.
        </p>
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b;">🚀 Başlangıç İçin:</h3>
          <ul style="color: #64748b;">
            <li>Profilinizi tamamlayın</li>
            <li>İlk aracınızı ekleyin</li>
            <li>AI asistanı test edin</li>
          </ul>
        </div>
        <a href="${variables.dashboardUrl || '#'}" style="display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Dashboard'a Git
        </a>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b;">
          <p>© 2024 OtoTakibim. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `;
  }

  /**
   * Hoş geldin email'i gönderir
   */
  async sendWelcomeEmail(userData: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<boolean> {
    try {
      const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
      
      const emailData: EmailData = {
        to: userData.email,
        subject: 'OtoTakibim\'e Hoş Geldiniz! 🚗',
        template: 'welcomeEmail',
        variables: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          dashboardUrl,
          companyName: 'OtoTakibim'
        }
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Hoş geldin email gönderilirken hata:', error);
      return false;
    }
  }

  /**
   * Genel email gönderir
   */
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const htmlContent = await this.loadTemplate(emailData.template, emailData.variables);
      
      const mailOptions = {
        from: `"OtoTakibim" <${process.env.SMTP_USER || 'noreply@ototakibim.com'}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: htmlContent
      };

      // Demo mode'da gerçek email göndermeyi simüle et
      if (process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true') {
        console.log('📧 Demo Mode - Email gönderildi:');
        console.log('To:', emailData.to);
        console.log('Subject:', emailData.subject);
        console.log('Template:', emailData.template);
        console.log('Variables:', emailData.variables);
        return true;
      }

      // Gerçek email gönder
      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email gönderildi:', info.messageId);
      return true;
    } catch (error) {
      console.error('Email gönderilirken hata:', error);
      return false;
    }
  }

  /**
   * Şifre sıfırlama email'i gönderir
   */
  async sendPasswordResetEmail(userData: {
    email: string;
    firstName: string;
    resetToken: string;
  }): Promise<boolean> {
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${userData.resetToken}`;
      
      const emailData: EmailData = {
        to: userData.email,
        subject: 'Şifre Sıfırlama - OtoTakibim',
        template: 'passwordReset',
        variables: {
          firstName: userData.firstName,
          resetUrl,
          companyName: 'OtoTakibim'
        }
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Şifre sıfırlama email gönderilirken hata:', error);
      return false;
    }
  }

  /**
   * Email servisinin durumunu kontrol eder
   */
  async testConnection(): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true') {
        console.log('📧 Demo Mode - Email servisi test edildi');
        return true;
      }

      await this.transporter.verify();
      console.log('📧 Email servisi bağlantısı başarılı');
      return true;
    } catch (error) {
      console.error('📧 Email servisi bağlantı hatası:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
