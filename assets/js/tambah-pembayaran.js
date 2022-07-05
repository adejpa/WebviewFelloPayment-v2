const userId = 1;     // User ID Dummy
const baseUrl = "https://bvnisora.com/be-dummy/api";    // API Dummy
const dataLength = sessionStorage.getItem("dataLength");
const vendorsLength = sessionStorage.getItem("vendorsLength");

$(document).ready(function() {

  // Load skeleton
  showSkeleton({
    status: true,
    vendorsLength: vendorsLength
  });
  
  // Load vendors
  getVendors();

  $("#vendor").on("click", ".data-content", function() {
    const vendorId = $(this).attr("data-id");
    const ranBalance = Math.floor(Math.random() * 100000);
    ;
    const data = {
      "user": userId,
      "vendor": vendorId,
      "balance": formatRupiah(ranBalance)
    };

    showSkeleton({
      status: true,
      vendorsLength: vendorsLength
    });

    $.ajax({
      type: "POST",
      dataType: "json",
      data: data,
      url: baseUrl + "/connected",
      crossOrigin: true,
      cache: false,
      success: function (res) {
        if (res.status) {
          setDataStorage("dataLength", parseInt(dataLength) + 1);
          setDataStorage("vendorsLength", parseInt(vendorsLength) - 1);
          setTimeout(() => {
            window.location.href = "index.html";
          }, 2000);
        } else {
          showSkeleton({ status: false });
        }
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log(xhr, textStatus, errorThrown);
        showSkeleton({ status: false });
      }
    });
  });
});

const skeletonTpl = `
  <li class="skeleton-item">
    <div class="skeleton-card w-100">
      <div class="skeleton-image skeleton-loading d-flex align-items-center"></div>
      <div class="skeleton-text flex-fill d-flex flex-column justify-content-center">
        <span class="skeleton-title skeleton-loading"></span>
        <span class="skeleton-desc skeleton-loading"></span>
      </div>
      <div class="flex-fill d-flex align-items-center justify-content-end">
        <span class="skeleton-balance skeleton-loading d-none"></span>
      </div>
      <div class="skeleton-arrow d-flex align-items-center">
        <img src="assets/img/ic-chevron-right@2x.png" class="chevron-right" alt="chevron-right" />
      </div>
    </div>
  </li>
`;

const vendorTpl = (data) => {
  return `
    <li class="data-item">
      <div class="data-content w-100" data-id="${data.id}">
        <div class="image-item d-flex align-items-center">
          <img src="${data.logo}" class="image-logo" alt="alt-logo" />
        </div>
        <div class="text-item flex-fill d-flex flex-column justify-content-center">
          <span class="title-item">${data.name}</span>
          <span class="desc-item">Hubungkan akun</span>
        </div>
        <div class="arrow-item d-flex align-items-center">
          <img src="assets/img/ic-chevron-right@2x.png" class="chevron-right" alt="chevron-right" />
        </div>
      </div>
    </li>
  `;
}

const showSkeleton = ({
  status,
  defaultLength = 3,
  dataLength = 0,
  vendorsLength = 0
}) => {
  if (status) {
    if (dataLength > 0 && vendorsLength > 0) {
      showSkeletonData(dataLength);
      showSkeletonVendors(vendorsLength);
    } else if (dataLength > 0 && vendorsLength == 0) {
      showSkeletonData(dataLength);
    } else if (vendorsLength > 0 && dataLength == 0) {
      showSkeletonVendors(vendorsLength);
    } else {
      for (let i = 0; i < defaultLength; i++) {
        $(".skeleton-list").append(skeletonTpl);
      }
    }
    $("#data").addClass("d-none");
    $("#vendor").addClass("d-none");
  } else {
    $(".skeleton-item").remove();
    $("#data").removeClass("d-none");
    $("#vendor").removeClass("d-none");
  }
};

const showSkeletonVendors = (length) => {
  for (let i = 0; i < length; i++) {
    $(".skeleton-list").append(skeletonTpl);
  }
}

const getVendors = () => {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: baseUrl + "/vendors_user/" + userId,
    crossOrigin: true,
    cache: false,
    success: function (res) {
      const { data } = res;

      setDataStorage("vendorsLength", data.length);

      setTimeout(() => {
        if (data.length > 0) {
          data.map(value => {
            $("#vendor").append(vendorTpl(value));
          });
        }
        showSkeleton({ status: false });
      }, 2000);
    },
    error: function(xhr, textStatus, errorThrown) {
      console.log(xhr, textStatus, errorThrown);
      showSkeleton({ status: false });
    }
  });
}

const setDataStorage = (key, value) => {
  sessionStorage.setItem(key, value);
}

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(number);
}