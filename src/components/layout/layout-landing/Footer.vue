<template>
  <div>
    <div class="border-t-[3px] border-solid border-secondary">
      <div class="py-4">
        <div class="m-auto mb-[10px] flex w-full max-w-[1264px] px-4">
          <div class="flex w-full justify-between">
            <div class="flex flex-col">
              <div class="mb-[10px] text-sm font-bold">Hỗ trợ khách hàng</div>
              <div class="flex flex-col text-xs">
                <a class="pt-2 pr-3" href="">Thẻ ưu đãi</a>
                <a class="pt-2 pr-3" href="">Hướng dẫn mua online</a>
                <a class="pt-2 pr-3" href="">Ưu đãi dành cho Doanh nghiệp</a>
                <a class="pt-2 pr-3" href="">Chính sách trả góp</a>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="mb-[10px] text-sm font-bold">Chính sách mua hàng</div>
              <div class="flex flex-col text-xs">
                <a class="pt-2 pr-3" href="">Điều kiện giao dịch chung</a>
                <a class="pt-2 pr-3" href="">Chính sách bảo hành</a>
                <a class="pt-2 pr-3" href="">Chính sách đổi trả</a>
                <a class="pt-2 pr-3" href="">Chính sách thanh toán</a>
                <a class="pt-2 pr-3" href="">Giao hàng và Lắp đặt tại nhà</a>
                <a class="pt-2 pr-3" href="">Dịch vụ lắp đặt và nâng cấp PC/ Laptop tại cửa hàng & TTBH</a>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="mb-[10px] text-sm font-bold">Thông tin Quân Lộc</div>
              <div class="flex flex-col text-xs">
                <a class="pt-2 pr-3" href="">Giới thiệu Quân Lộc</a>
                <a class="pt-2 pr-3" href="">Hệ thống cửa hàng</a>
                <a class="pt-2 pr-3" href="">Trung tâm bảo hành</a>
                <a class="pt-2 pr-3" href="">Chính sách bảo mật</a>
                <a class="pt-2 pr-3" href="">Tin công nghệ</a>
                <a class="pt-2 pr-3" href="">Hỏi đáp</a>
                <a class="pt-2 pr-3" href="">Tuyển dụng</a>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="mb-[10px] text-sm font-bold">Cộng đồng Quân Lộc</div>
              <div class="flex flex-col text-xs">
                <div class="pt-2 pr-3">
                  Gọi mua hàng (miễn phí)
                  <a class="text-hyperlink" href="tel:18000018">18000018</a>
                </div>
                <div class="pt-2 pr-3">
                  Gọi chăm sóc
                  <a class="text-hyperlink" href="tel:18000018">18000018</a>
                </div>
                <a class="flex items-center pt-2 pr-3" href="">
                  <base-icon icon="icons8-facebook"></base-icon>
                  <div class="ml-1">Facebook Quân Lộc</div>
                </a>
                <a class="flex items-center pt-2 pr-3" href="">
                  <base-icon icon="icons8-youtube"></base-icon>
                  <div class="ml-1">Media Quân Lộc</div>
                </a>
                <a class="flex items-center pt-2 pr-3" href="">
                  <base-icon icon="icons8-telegram-app"></base-icon>
                  <div class="ml-1">Telegram Quân Lộc</div>
                </a>
                <a class="flex items-center pt-2 pr-3" href="">
                  <base-icon icon="icons8-tiktok"></base-icon>
                  <div class="ml-1">Tiktok Quân Lộc</div>
                </a>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="mb-[10px] text-sm font-bold">Email liên hệ</div>
              <div class="flex-col text-xs">
                <div class="pt-2 pr-3">
                  Hỗ trợ Khách hàng:
                  <br />
                  <a class="text-hyperlink" href="mailto:quanloc@gmail.com">quanloc@gmail.com</a>
                </div>
                <div class="pt-2 pr-3">
                  Liên hệ báo giá:
                  <br />
                  <a class="text-hyperlink" href="mailto:quanloc@gmail.com">quanloc@gmail.com</a>
                </div>
                <div class="pt-2 pr-3">
                  Hợp tác phát triển:
                  <br />
                  <a class="text-hyperlink" href="mailto:quanloc@gmail.com">quanloc@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="m-auto mb-[10px] flex w-full max-w-[1264px] px-4">
          <div class="flex w-[400px]">
            <div class="flex flex-col">
              <h3 class="mb-4 text-sm font-bold">Phương thức thanh toán</h3>
              <div class="flex items-center gap-x-[20px]">
                <div class="flex flex-col">
                  <base-icon icon="qrcode" size="36"></base-icon>
                  <div class="text-xs">QR Code</div>
                </div>
                <div class="flex flex-col">
                  <base-icon icon="money-time" size="36"></base-icon>
                  <div class="text-xs">Trả góp</div>
                </div>
                <div class="flex flex-col">
                  <base-icon icon="money" size="36"></base-icon>
                  <div class="text-xs">Tiền mặt</div>
                </div>
                <div class="flex flex-col">
                  <base-icon icon="payment-method" size="36"></base-icon>
                  <div class="text-xs">Internet Banking</div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <h3 class="mb-4 text-sm font-bold">Danh sách các ngân hàng thanh toán online</h3>
            <img alt="" src="https://shopfront-cdn.tekoapis.com/static/vnpay_banks.png" />
          </div>
        </div>
      </div>
      <div class="bg-[#e9edf2] py-[30px]">
        <div class="m-auto flex w-full max-w-[1264px] px-4 py-4">
          <div class="w-ful flex flex-wrap justify-between gap-x-[20px]">
            <div class="left flex-1">
              <h2 class="mb-4 text-sm font-bold">Công ty cổ phần thương mại - dịch vụ Quân Lộc</h2>
              <div class="text-xs">
                © 2022 - 2023 Công Ty Cổ Phần Thương Mại - Dịch Vụ Quân Lộc
                <br />
                Giấy chứng nhận đăng ký doanh nghiệp: 0304998358 do Sở KH-ĐT TP.HCM cấp lần đầu ngày 30 tháng 05 năm 2022
              </div>
            </div>
            <div class="align">
              <div class="text-xs">
                <h3 class="font-bold">Địa chỉ trụ sở chính:</h3>
                <p>Tầng 5, Số 117-119-121 Nguyễn Du, Phường Bến Thành, Quận 1, Thành Phố Hồ Chí Minh</p>
              </div>
              <div class="text-xs">
                <h3 class="font-bold">Văn phòng điều hành miền Bắc:</h3>
                <p>Tầng 6, Số 1 Phố Thái Hà, Phường Trung Liệt, Quận Đống Đa, Hà Nội</p>
              </div>
              <div class="text-xs">
                <h3 class="font-bold">Văn phòng điều hành miền Nam:</h3>
                <p>Tầng 11 Minh Long Tower, số 17 Bà Huyện Thanh Quan, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh</p>
              </div>
            </div>
            <div class="right">
              <img alt="" src="https://shopfront-cdn.tekoapis.com/common/da-dang-ky.png" />
              <img
                alt=""
                src="https://images.dmca.com/Badges/dmca-badge-w100-2x1-02.png?ID=53b44883-ed2a-434d-902b-5adce10aafd5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
