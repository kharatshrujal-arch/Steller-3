use wasm_bindgen::prelude::*;

const STROOPS_PER_XLM: f64 = 10_000_000.0;

#[wasm_bindgen]
pub fn stroops_to_xlm(stroops: i64) -> String {
    format!("{:.7}", stroops as f64 / STROOPS_PER_XLM)
}

#[wasm_bindgen]
pub fn xlm_to_stroops(xlm: &str) -> Result<i64, JsValue> {
    let value = xlm.trim().parse::<f64>().map_err(|_| JsValue::from_str("Amount must be a number"))?;
    if value <= 0.0 {
        return Err(JsValue::from_str("Amount must be greater than zero"));
    }
    Ok((value * STROOPS_PER_XLM).round() as i64)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn converts_stroops_to_xlm() {
        assert_eq!(stroops_to_xlm(25_000_000), "2.5000000");
    }

    #[test]
    fn rejects_negative_amounts() {
        assert!(xlm_to_stroops("-1").is_err());
    }
}
