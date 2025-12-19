/* =========================================================
       JS: DATA + RENDER + MODAL CONTROL
       ========================================================= */
    /* =========================================================
       1) DỮ LIỆU CHÍNH SÁCH (ĐÃ GẮN ĐẦY ĐỦ NỘI DUNG BẠN GỬI)
       - NOTE: nếu cần sửa câu chữ, chỉ sửa trong content
       ========================================================= */
    const POLICIES = [
      /* =========================
         CHÍNH SÁCH THANH TOÁN
         ========================= */
      {
        id: "payment",
        title: "Chính sách thanh toán",
        sub: "Các hình thức thanh toán linh hoạt và an toàn tại Tiệm Ăn Vặt Ngon Nhất Thế Giới.",
        content: `
          <p>
            Để mang lại trải nghiệm mua sắm thuận tiện nhất,
            <b>Tiệm Ăn Vặt Ngon Nhất Thế Giới</b> hỗ trợ đa dạng các phương thức thanh toán linh hoạt và an toàn dưới đây:
          </p>

          <h3>1. Thanh toán khi nhận hàng (COD)</h3>
          <p><b>Hình thức:</b> Quý khách thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng (Shipper) ngay tại thời điểm nhận món ăn.</p>
          <p><b>Lưu ý:</b> Quý khách vui lòng kiểm tra kỹ số tiền cần thanh toán trên hóa đơn hoặc xác nhận từ nhân viên Tiệm trước khi giao tiền cho Shipper.</p>

          <h3>2. Chuyển khoản ngân hàng (Quét mã QR)</h3>
          <p><b>Hình thức:</b> Khách hàng chuyển khoản trực tiếp vào tài khoản ngân hàng của Tiệm.</p>
          <p><b>Tiện ích:</b> Chúng tôi khuyến khích sử dụng hình thức quét mã QR (VietQR) được cung cấp trên website hoặc do nhân viên gửi để đảm bảo chính xác thông tin tài khoản và số tiền, giúp đơn hàng được xác nhận nhanh chóng.</p>

          <h3>3. Thanh toán qua Ví điện tử</h3>
          <p><b>Đơn vị chấp nhận:</b> Tiệm hỗ trợ thanh toán qua ví điện tử <b>MoMo</b>.</p>
          <p><b>Quy trình:</b> Quý khách có thể chọn phương thức này tại bước thanh toán trên website hoặc quét mã thanh toán do nhân viên cung cấp.</p>
        `
      },

      /* =========================
         CHÍNH SÁCH GIAO HÀNG
         ========================= */
      {
        id: "shipping",
        title: "Chính sách giao hàng",
        sub: "Phạm vi giao, thời gian giao, phí vận chuyển và lưu ý khi nhận hàng.",
        content: `
          <p>
            Với định hướng <b>“Chất lượng món ăn là ưu tiên hàng đầu”</b>, Tiệm áp dụng các tiêu chuẩn chặt chẽ
            về phạm vi và quy cách giao nhận nhằm đảm bảo 100% sản phẩm đến tay Quý khách luôn giữ được độ ngon và đúng vị như mong muốn.
          </p>

          <h3>1. Cam kết chất lượng giao hàng</h3>
          <p>Để khắc phục nhược điểm của việc vận chuyển đồ ăn tươi sống, Tiệm áp dụng quy trình đóng gói chuyên biệt:</p>
          <ul>
            <li><b>Đối với đồ uống lạnh:</b> áp dụng quy cách đóng gói riêng (đá và nước để riêng) cho toàn bộ đơn hàng giao đi. Điều này giúp đồ uống giữ nguyên độ không bị hòa tan hay nhạt vị trong quá trình di chuyển.</li>
            <li><b>Đối với đồ ăn nóng:</b> sản phẩm luôn được bảo quản trong <b>túi giữ nhiệt chuyên dụng</b> từ khi chế biến xong cho đến khi trao tay Quý khách.</li>
          </ul>

          <h3>2. Khu vực phục vụ trên Website</h3>
          <p>
            Do đặc thù sản phẩm cần sử dụng ngay để đảm bảo chất lượng, hệ thống đặt hàng trực tuyến của Tiệm hiện chỉ mở giới hạn
            trong 03 quận trung tâm của Hà Nội (bán kính tối ưu dưới 5km):
            <b>Quận Đống Đa, Quận Hoàn Kiếm, Quận Hai Bà Trưng</b>.
          </p>

          <h3>3. Biểu phí giao hàng</h3>
          <p>Chúng tôi áp dụng mức phí vận chuyển cố định và minh bạch theo khu vực để Quý khách an tâm đặt hàng:</p>

          <!-- NOTE: Bảng phí ship (đã style bằng class .policy-table) -->
          <div class="policy-table-wrap">
            <table class="policy-table">
              <thead>
                <tr>
                  <th>Khu vực</th>
                  <th>Phí vận chuyển</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Quận Đống Đa</td>
                  <td>12.000đ</td>
                </tr>
                <tr>
                  <td>Quận Hai Bà Trưng</td>
                  <td>20.000đ</td>
                </tr>
                <tr>
                  <td>Quận Hoàn Kiếm</td>
                  <td>22.000đ</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>4. Hỗ trợ giao hàng các khu vực khác</h3>
          <p>
            Đối với Quý khách hàng ở các quận lân cận (như Ba Đình, Thanh Xuân, Cầu Giấy...) có nhu cầu thưởng thức,
            vui lòng liên hệ trực tiếp qua <b>Hotline</b> hoặc nhắn tin qua <b>Fanpage</b>.
          </p>
          <p>
            Nhân viên sẽ kiểm tra vị trí cụ thể. Nếu khoảng cách đảm bảo thời gian di chuyển an toàn cho chất lượng món ăn,
            chúng tôi sẽ hỗ trợ đặt dịch vụ giao hàng ngoài (Grab/Be...) và thông báo phí ship thực tế tới Quý khách.
          </p>

          <h3>5. Thời gian giao hàng</h3>
          <p><b>Khung giờ hoạt động:</b> 9:00 – 21:30 tất cả các ngày trong tuần (bao gồm cả các ngày lễ, ngày Tết).</p>
          <p><b>Thời gian nhận hàng dự kiến:</b> 30 – 45 phút kể từ khi đơn hàng được xác nhận thành công (bao gồm thời gian chế biến và di chuyển).</p>

          <h3>6. Lưu ý chung</h3>
          <ul>
            <li>Trong trường hợp điều kiện thời tiết bất lợi (mưa bão) hoặc giờ cao điểm tắc đường, thời gian giao hàng có thể chênh lệch <b>10 – 15 phút</b>. Tiệm sẽ chủ động liên hệ để thông báo tới Quý khách.</li>
            <li>Quý khách vui lòng kiểm tra kỹ tình trạng sản phẩm (độ nóng, bao bì...) ngay khi nhận hàng. Mọi phản hồi về chất lượng xin được Tiệm hỗ trợ xử lý ngay lập tức.</li>
          </ul>
        `
      },

      /* =========================
         CHÍNH SÁCH BẢO MẬT
         ========================= */
      {
        id: "privacy",
        title: "Chính sách bảo mật",
        sub: "Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của khách hàng.",
        content: `
          <p>
            Tại <b>Tiệm Ăn Vặt Ngon Nhất Thế Giới</b>, chúng tôi hiểu rằng Quý khách quan tâm đến việc thông tin cá nhân
            của mình được sử dụng và chia sẻ như thế nào. Tiệm cam kết tôn trọng và bảo vệ quyền riêng tư của Quý khách theo các quy định dưới đây.
          </p>

          <h3>1. Phạm vi thu thập thông tin</h3>
          <p>Để xử lý đơn hàng nhanh chóng và chính xác, chúng tôi thu thập các thông tin cơ bản và cần thiết nhất từ Quý khách, bao gồm:</p>
          <ul>
            <li>Họ và tên người nhận</li>
            <li>Số điện thoại liên hệ</li>
            <li>Địa chỉ giao hàng chi tiết</li>
          </ul>
          <p>Mọi thông tin trên được thu thập khi Quý khách thực hiện đặt hàng trực tiếp qua Website, Fanpage hoặc Hotline của Tiệm.</p>

          <h3>2. Mục đích sử dụng thông tin</h3>
          <ul>
            <li><b>Xử lý giao nhận:</b> Sử dụng tên, số điện thoại và địa chỉ để xác nhận đơn hàng, tính phí vận chuyển và giao món ăn đến đúng người, đúng nơi.</li>
            <li><b>Dữ liệu đơn hàng:</b> Thông báo tới Quý khách về tình trạng đơn hàng, xác nhận thời gian giao hoặc xử lý các vấn đề phát sinh (nếu có).</li>
            <li><b>Chăm sóc khách hàng:</b> Giải quyết khiếu nại hoặc gửi các thông tin ưu đãi đặc biệt (nếu thực hiện khi được Quý khách đồng ý).</li>
          </ul>

          <h3>3. Chia sẻ thông tin với bên thứ ba</h3>
          <p>Tiệm cam kết <b>không bán, trao đổi hoặc chia sẻ</b> thông tin cá nhân của Quý khách cho bất kỳ bên thứ ba nào vì mục đích thương mại.</p>
          <ul>
            <li><b>Đối tác vận chuyển:</b> Cung cấp Tên, Số điện thoại và Địa chỉ cho đội ngũ giao hàng (Shipper nội bộ hoặc GrabExpress) để hoàn tất việc giao nhận.</li>
            <li><b>Yêu cầu pháp lý:</b> Cung cấp thông tin khi có yêu cầu bằng văn bản từ cơ quan nhà nước có thẩm quyền theo quy định của pháp luật.</li>
          </ul>

          <h3>4. Thời gian lưu trữ</h3>
          <p>Thông tin cá nhân của Quý khách sẽ được lưu trữ trên hệ thống quản lý nội bộ cho đến khi hoàn tất đơn hàng hoặc khi Quý khách yêu cầu hủy bỏ thông tin.</p>

          <h3>5. Quyền lợi của khách hàng</h3>
          <ul>
            <li><b>Yêu cầu kiểm tra, chỉnh sửa:</b> Quý khách có thể yêu cầu nhân viên cập nhật lại số điện thoại hoặc địa chỉ mới bất cứ lúc nào.</li>
            <li><b>Yêu cầu xóa bỏ:</b> Quý khách có quyền yêu cầu Tiệm gỡ bỏ thông tin cá nhân khỏi hệ thống lưu trữ bằng cách liên hệ qua Hotline.</li>
          </ul>

          <h3>6. Thông tin liên hệ</h3>
          <p>Nếu Quý khách có bất kỳ thắc mắc hoặc góp ý nào liên quan đến Chính sách bảo mật, vui lòng liên hệ với chúng tôi:</p>
          <p><b>Hotline:</b> 0843337324</p>
          <p><b>Fanpage:</b> Tiệm Ăn Vặt Ngon Nhất Thế Giới</p>
        `
      },

      /* =========================
         CHÍNH SÁCH SẢN PHẨM
         ========================= */
      {
        id: "product",
        title: "Chính sách về sản phẩm",
        sub: "Tiêu chuẩn chất lượng, minh bạch thông tin và xử lý khi hết món.",
        content: `
          <p>
            Tại <b>Tiệm Ăn Vặt Ngon Nhất Thế Giới</b>, chúng tôi tâm niệm rằng một món ăn ngon không chỉ đến từ hương vị hấp dẫn
            mà phải bắt đầu từ sự an tâm tuyệt đối của khách hàng. Dưới đây là những nguyên tắc vàng trong quy trình vận hành và kiểm soát chất lượng của Tiệm.
          </p>

          <h3>1. Tiêu chuẩn vệ sinh & Tuân thủ An toàn thực phẩm</h3>
          <p>Chúng tôi đặt sức khỏe của khách hàng là ưu tiên hàng đầu. Quy trình hoạt động của Tiệm tuân thủ nghiêm ngặt các quy định hiện hành của Nhà nước:</p>
          <ul>
            <li><b>Tuân thủ pháp lý:</b> Tiệm hoạt động dưới sự giám sát của chính quyền địa phương và đã thực hiện đầy đủ cam kết đảm bảo an toàn thực phẩm đối với cơ sở kinh doanh theo quy định pháp luật.</li>
            <li><b>Nguyên liệu minh bạch:</b> 100% nguyên liệu (thịt, mì, rau củ, gia vị...) nhập từ các nhà cung cấp uy tín, siêu thị lớn với hóa đơn và chứng từ xuất xứ rõ ràng. Tiệm nói <b>KHÔNG</b> với thực phẩm trôi nổi, không rõ nguồn gốc.</li>
            <li><b>Quy trình chế biến an toàn:</b> Tuân thủ nguyên tắc chế biến một chiều. Dụng cụ nấu nướng được vệ sinh, tiệt trùng định kỳ. Nhân viên luôn tuân thủ quy định vệ sinh cá nhân trong quá trình chế biến và đóng gói.</li>
            <li><b>Thành phẩm chuẩn chất lượng:</b> Món ăn đến tay khách hàng đảm bảo giữ trọn hương vị và nhiệt độ tiêu chuẩn (nóng hổi hoặc lạnh sâu) nhờ cách đóng gói chuyên dụng.</li>
          </ul>

          <h3>2. Minh bạch thông tin sản phẩm</h3>
          <ul>
            <li><b>Hình ảnh thực tế:</b> Cam kết 100% hình ảnh và video trên Website/Fanpage là ảnh thật được chụp tại Tiệm. Sản phẩm thực tế Quý khách nhận được sẽ đúng với hình ảnh quảng bá.</li>
            <li><b>Thông tin chi tiết:</b> Mỗi món ăn đều được niêm yết rõ ràng về thành phần chính và định lượng để khách hàng dễ dàng hình dung.</li>
            <li><b>Cá nhân hóa khẩu vị:</b> Các tùy chọn về mức độ cay, gia giảm nguyên liệu (thêm/bớt topping) luôn được hiển thị chi tiết để Quý khách tùy chỉnh theo sở thích riêng.</li>
          </ul>

          <h3>3. Quy định xử lý khi hết món (Hết hàng)</h3>
          <p>Hệ thống Website luôn nỗ lực cập nhật liên tục trạng thái tồn kho theo thời gian thực. Tuy nhiên, trong những trường hợp hiếm khi nguyên liệu hết đột xuất ngay sau khi Quý khách vừa chốt đơn, Tiệm cam kết xử lý trách nhiệm như sau:</p>
          <p><b>Thời gian phản hồi:</b> Nhân viên sẽ liên hệ lại ngay lập tức (trong vòng 5–10 phút từ khi nhận đơn).</p>
          <p><b>Phương án giải quyết linh hoạt:</b></p>
          <ul>
            <li>Tư vấn đổi sang món khác có giá trị và chất lượng tương đương.</li>
            <li>Hoàn tiền 100% giá trị món đã hết (nếu Quý khách đã thanh toán trước).</li>
            <li>Gửi tặng <b>Mã giảm giá (Voucher)</b> thay cho lời xin lỗi chân thành của Tiệm áp dụng cho lần đặt hàng kế tiếp.</li>
          </ul>
        `
      },

      /* =========================
         CHÍNH SÁCH ĐỔI TRẢ
         ========================= */
      {
        id: "return",
        title: "Chính sách đổi trả",
        sub: "Quy định xử lý sự cố và điều kiện tiếp nhận khiếu nại.",
        content: `
          <p>
            Với đặc thù sản phẩm là thực phẩm chế biến nóng và sử dụng trong ngày, Tiệm Ăn Vặt Ngon Nhất Thế Giới áp dụng quy trình xử lý khiếu nại rõ ràng để đảm bảo vệ sinh an toàn thực phẩm.
          </p>

          <h3>1. Phân loại sự cố & phương án giải quyết</h3>

          <!-- NOTE: Bạn muốn giữ đúng “dạng bảng” như ảnh thì dùng bảng này -->
          <div class="policy-table-wrap">
            <table class="policy-table">
              <thead>
                <tr>
                  <th>Hình thức xử lý</th>
                  <th>Áp dụng cho các trường hợp</th>
                  <th>Cơ chế thực hiện</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>ĐỔI MÓN MỚI</b><br><span style="color:#6b7280;">(Giao bù miễn phí)</span></td>
                  <td>
                    <b>Sai/Thiếu món:</b> Giao không đúng đơn đặt hàng.<br>
                    <b>Lỗi vận chuyển:</b> Đồ ăn bị đổ, vỡ, biến dạng nặng do quá trình giao hàng.<br>
                    <b>Lỗi chế biến:</b> Món ăn bị sống, cháy hoặc sai quy cách nghiêm trọng.
                  </td>
                  <td>Tiệm sẽ giao lại ngay món mới đạt chuẩn đến địa chỉ của Quý khách và thu hồi món lỗi (nếu cần).</td>
                </tr>
                <tr>
                  <td><b>HOÀN TIỀN 100%</b><br><span style="color:#6b7280;">(Trả lại hàng)</span></td>
                  <td>
                    <b>Vấn đề vệ sinh:</b> Sản phẩm có dấu hiệu hư hỏng, ôi thiu hoặc có dị vật.<br>
                    <b>Sự cố không thể khắc phục:</b> Khi Quý khách không đồng ý phương án đổi món hoặc Tiệm không còn nguyên liệu để làm lại.
                  </td>
                  <td>Hoàn lại toàn bộ giá trị món lỗi qua chuyển khoản hoặc tiền mặt trong vòng 24h.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>2. Điều kiện tiếp nhận khiếu nại (Bắt buộc)</h3>
          <p>Để đảm bảo tính xác thực, yêu cầu đổi/trả chỉ được chấp nhận khi thỏa mãn đồng thời 03 điều kiện sau:</p>
          <ul>
            <li><b>Thời gian báo lỗi:</b> Quý khách vui lòng liên hệ trong vòng <b>15 phút</b> kể từ khi nhận hàng (sau thời gian này, chất lượng món ăn bị ảnh hưởng bởi môi trường bên ngoài nên Tiệm xin phép từ chối xử lý).</li>
            <li><b>Bằng chứng:</b> Cung cấp <b>Hình ảnh hoặc Video</b> rõ nét ghi lại tình trạng sản phẩm.</li>
            <li><b>Giữ hiện trạng:</b> Sản phẩm lỗi phải được giữ lại và chưa bị sử dụng quá 20%. Tiệm có quyền yêu cầu thu hồi sản phẩm lỗi để kiểm định chất lượng nội bộ.</li>
          </ul>

          <h3>3. Các trường hợp từ chối hỗ trợ</h3>
          <p>Tiệm xin phép miễn trừ trách nhiệm trong các trường hợp:</p>
          <ul>
            <li><b>Khẩu vị chủ quan:</b> khiếu nại do cảm nhận cá nhân (mặn/nhạt, ngon/dở) mà không phải lỗi kỹ thuật chế biến hoặc sai lệch so với mô tả chuẩn.</li>
            <li><b>Lỗi bảo quản:</b> sản phẩm bị hư hỏng do khách hàng không dùng ngay hoặc bảo quản sai cách (VD: để đồ chiên bị ủ/để ngoài quá lâu).</li>
            <li><b>Thay đổi ý định:</b> yêu cầu đổi món/hủy đơn sau khi Tiệm đã thực hiện chế biến hoặc đã bàn giao cho Shipper.</li>
          </ul>

          <h3>4. Quy định về hủy đơn & giao hàng không thành công</h3>
          <ul>
            <li><b>Hủy đơn:</b> không chấp nhận hủy đơn khi món ăn đã được chế biến.</li>
            <li><b>Giao không thành công:</b> nếu Shipper liên hệ giao hàng 03 lần không được (hoặc khách từ chối nhận không có lý do chính đáng), đơn hàng được xem là hủy.
              Tiệm sẽ không hoàn tiền (với đơn đã thanh toán) và xin phép từ chối phục vụ COD cho các lần đặt hàng sau.</li>
          </ul>

          <h3>5. Quy trình xử lý</h3>
          <ol>
            <li><b>Bước 1:</b> Khách gửi phản hồi + hình ảnh/video qua Fanpage/Hotline.</li>
            <li><b>Bước 2:</b> Tiệm tiếp nhận và xác minh lỗi (trong vòng 10 phút).</li>
            <li><b>Bước 3:</b> Thống nhất phương án Đổi món hoặc Hoàn tiền và thực hiện ngay lập tức.</li>
          </ol>
        `
      }
    ];

    /* =========================================================
       2) ICON cho nút tròn
       ========================================================= */
    function iconChevronRight() {
      return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10 7l5 5-5 5"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }

    /* =========================================================
       3) RENDER danh sách chính sách
       ========================================================= */
    const grid = document.getElementById("policyGrid");

    function renderPolicies(){
      grid.innerHTML = "";

      POLICIES.forEach((p) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "policy-item";
        item.dataset.id = p.id;

        item.innerHTML = `
          <div class="policy-title">${p.title}</div>
          <div class="pill">${iconChevronRight()}</div>
        `;

        /* NOTE: click item => mở popup */
        item.addEventListener("click", () => openPolicy(p.id));

        grid.appendChild(item);
      });
    }

    /* =========================================================
       4) MODAL open/close + active state + focus restore
       ========================================================= */
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalSub = document.getElementById("modalSub");
    const modalBody = document.getElementById("modalBody");

    const closeBtn = document.getElementById("closeBtn");
    const closeBtn2 = document.getElementById("closeBtn2");
    const okBtn = document.getElementById("okBtn");

    let lastFocusedButton = null;

    function setActive(id){
      document.querySelectorAll(".policy-item").forEach(btn=>{
        btn.classList.toggle("is-active", btn.dataset.id === id);
      });
    }

    function openPolicy(id){
      const p = POLICIES.find(x => x.id === id);
      if(!p) return;

      lastFocusedButton = document.activeElement;

      setActive(id);
      modalTitle.textContent = p.title;
      modalSub.textContent = p.sub || "";
      modalBody.innerHTML = p.content || "<p>Đang cập nhật nội dung.</p>";

      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeModal(){
      modal.classList.remove("is-open");
      document.body.style.overflow = "";

      if(lastFocusedButton && typeof lastFocusedButton.focus === "function"){
        lastFocusedButton.focus();
      }
    }

    closeBtn.addEventListener("click", closeModal);
    closeBtn2.addEventListener("click", closeModal);
    okBtn.addEventListener("click", closeModal);

    /* NOTE: click ra ngoài dialog => đóng */
    modal.addEventListener("click", (e) => {
      if(e.target === modal) closeModal();
    });

    /* NOTE: nhấn ESC => đóng */
    document.addEventListener("keydown", (e) => {
      if(e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });

    /* =========================================================
       5) INIT
       ========================================================= */
    renderPolicies();