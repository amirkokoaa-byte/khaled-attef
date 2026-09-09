sed -i 's/import { useAppContext } from "..\/context";//g' src/components/Header.tsx
sed -i 's/import { BannerImage, BannerEffect } from "..\/types";/import { BannerImage, BannerEffect } from "..\/types";\nimport { useAppContext } from "..\/context";/g' src/components/Header.tsx
sed -i '/export function Header(/a \  const { t } = useAppContext();' src/components/Header.tsx
sed -i 's/إدارة الغلاف/{t("إدارة الغلاف", "Manage Banner")}/g' src/components/Header.tsx

sed -i 's/import { BannerImage, BannerEffect } from "..\/types";/import { BannerImage, BannerEffect } from "..\/types";\nimport { useAppContext } from "..\/context";/g' src/components/ManageBannersModal.tsx
sed -i '/export function ManageBannersModal(/a \  const { t } = useAppContext();' src/components/ManageBannersModal.tsx
sed -i 's/إدارة صور غلاف التايم لاين/{t("إدارة صور غلاف التايم لاين", "Manage Timeline Banners")}/g' src/components/ManageBannersModal.tsx
sed -i 's/لا يوجد صور حالياً./{t("لا يوجد صور حالياً.", "No images currently.")}/g' src/components/ManageBannersModal.tsx
sed -i 's/تأثير الانتقال (Transition Effect)/{t("تأثير الانتقال (Transition Effect)", "Transition Effect")}/g' src/components/ManageBannersModal.tsx
sed -i "s/جاري الرفع.../{t('جاري الرفع...', 'Uploading...')}/g" src/components/ManageBannersModal.tsx
sed -i "s/رفع صور جديدة/{t('رفع صور جديدة', 'Upload New Images')}/g" src/components/ManageBannersModal.tsx
sed -i "s/>إلغاء</>{t('إلغاء', 'Cancel')}</g" src/components/ManageBannersModal.tsx
sed -i "s/حفظ التغييرات/{t('حفظ التغييرات', 'Save Changes')}/g" src/components/ManageBannersModal.tsx

