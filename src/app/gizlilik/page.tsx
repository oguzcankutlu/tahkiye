export default function GizlilikPage() {
    return (
        <div className="w-full pb-20">
            <div className="mb-8 border-b border-border/40 pb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Gizlilik Politikası
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Son güncellenme: 22 Şubat 2026
                </p>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-primary">
                <h3>1. Veri Toplama</h3>
                <p>
                    Tahkiye.tr olarak kullanıcı deneyimini artırmak amacıyla minimum düzeyde veri toplamaktayız. Platforma kayıt olurken paylaştığınız e-posta adresi, kullanıcı adı ve seçtiğiniz şehir gibi bilgiler tamamen güvenli sunucularımızda şifrelenerek saklanmaktadır.
                </p>

                <h3>2. Çerezler (Cookies)</h3>
                <p>
                    Oturum yönetimi (Giriş yapılmış durumda kalmanız vb.) ve tercih ettiğiniz temanın (Aydınlık/Koyu) hatırlanması gibi temel platform işlevleri için çerezleri kullanıyoruz. İzleme (tracking) veya üçüncü parti reklam takibi amacıyla çerez kullanmıyoruz.
                </p>

                <h3>3. Bilgi Paylaşımı</h3>
                <p>
                    Kişisel verileriniz hiçbir kurum, kuruluş veya üçüncü şahısla ticari amaçlarla paylaşılmaz. Yürürlükteki yerel yasalara riayet etmekle yükümlüyüz.
                </p>

                <h3>4. İletişim</h3>
                <p>
                    Verilerinizle ilgili haklarınızı kullanmak ve bizimle iletişime geçmek için <strong>iletisim@tahkiye.tr</strong> adresinden bize ulaşabilirsiniz.
                </p>
            </div>
        </div>
    )
}
