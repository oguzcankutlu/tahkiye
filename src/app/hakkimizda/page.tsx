export default function HakkimizdaPage() {
    return (
        <div className="w-full pb-20">
            <div className="mb-8 border-b border-border/40 pb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Hakkımızda
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Tahkiye: Öğrenim Akışına Odaklanan Dijital Bilgi Ağı
                </p>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-primary prose-p:leading-relaxed">
                <p className="text-lg font-medium text-foreground">
                    Modern çağın bilgi kirliliğinden ve gürültüsünden uzaklaşarak derinlemesine içerik okuma ve düşünce üretme fikriyle yola çıktık.
                </p>

                <h3>Misyonumuz</h3>
                <p>
                    Tahkiye, okuyucunun sadece yüzeysel olarak tüketmek yerine yazılanlarla derin bir <strong>öğrenim akışı (flow)</strong> içerisine girmesini hedefler. Algoritmaların bizi sürekli kısa ve hızlı içeriklere yönlendirdiği bu dönemde, bizler "yavaşlamayı" ve "derinleşmeyi" savunan yeni nesil bir dijital ağ inşa ediyoruz.
                </p>

                <h3>Ne Değiliz?</h3>
                <p>
                    Tahkiye klasik bir sosyal medya platformu veya geleneksel bir sözlük formatı değildir. Burada amaç kişisel atışmalar veya popüler kültür trendlerini yakalamak değil; aksine kalıcı, nitelikli ve zamanı geçmeyen bir <em>dijital hafıza</em> oluşturmaktır.
                </p>

                <h3>Ekibimiz</h3>
                <p>
                    BrandCore güvencesiyle hayata geçirilen bu proje, felsefe, edebiyat, teknoloji ve sanata gönül vermiş, okumanın iyileştirici gücüne inanan küçük ama tutkulu bir ekip tarafından yönetilmektedir.
                </p>
            </div>
        </div>
    )
}
