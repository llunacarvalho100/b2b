import { PitchTemplates } from '../types/lead.js';

export function createWhatsAppPitch(
  businessName: string,
  category: string
): string {
  return (
    `Olá equipe da ${businessName}! Tudo bem?\n\n` +
    `Estava buscando por ${category.toLowerCase()} na região no Google e notei que vocês têm ótimas avaliações, mas ainda não possuem um site oficial cadastrado na busca.\n\n` +
    `Muitos clientes acabam indo para concorrentes por não encontrarem um site rápido para ver seus serviços/produtos.\n\n` +
    `Trabalho com desenvolvimento de sites e páginas de alta conversão. Poderia te enviar uma prévia de como ficaria a presença digital da ${businessName}?`
  );
}

export function createColdCallScript(
  businessName: string,
  category: string
): string {
  return (
    `"Olá, por gentileza, quem é o responsável pela presença digital ou novos clientes da ${businessName}?\n` +
    `Aqui é da agência de presença online. Vi o perfil de vocês no Google com excelentes recomendações, porém sem um site oficial indexado.\n` +
    `Hoje, mais de 70% das buscas na sua região pesquisam antes pelo site para fechar negócio. ` +
    `Gostaria de agendar 10 minutos para mostrar uma demonstração sem compromisso de como dobrar seus contatos via Google."`
  );
}

export function createEmailScript(
  businessName: string,
  category: string
): string {
  return (
    `Assunto: Oportunidade de expansão e novo site para ${businessName}\n\n` +
    `Olá equipe ${businessName},\n\n` +
    `Encontrei sua empresa na categoria de ${category} e notei que vocês se destacam pela reputação local, mas os clientes que buscam no Google não encontram um site oficial estruturado.\n\n` +
    `Criamos sites rápidos, otimizados para celular e Google Maps. Podemos conversar esta semana para apresentar uma proposta sob medida?\n\n` +
    `Atenciosamente,\nEspecialista em Presença Digital`
  );
}

export function generateLeadPitches(
  businessName: string,
  category: string
): PitchTemplates {
  return {
    whatsapp: createWhatsAppPitch(businessName, category),
    phoneScript: createColdCallScript(businessName, category),
    emailScript: createEmailScript(businessName, category),
  };
}
